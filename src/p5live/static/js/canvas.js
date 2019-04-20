'use strict'

const vertex = `
attribute vec2 a_position;
varying vec2 v_position;
void main()
{
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_position = a_position;
}
`;

const fragment = `
precision highp float;

const float M_PI = 3.14159265358979323846;
const float INFINITY = 1000000000.;
const int PLANE = 1;
const int SPHERE_0 = 2;
const int SPHERE_1 = 3;

uniform float u_aspect_ratio;
varying vec2 v_position;

uniform vec3 sphere_position_0;
uniform float sphere_radius_0;
uniform vec3 sphere_color_0;

uniform vec3 sphere_position_1;
uniform float sphere_radius_1;
uniform vec3 sphere_color_1;

uniform vec3 plane_position;
uniform vec3 plane_normal;

uniform float light_intensity;
uniform vec2 light_specular;
uniform vec3 light_position;
uniform vec3 light_color;

uniform float ambient;
uniform vec3 O;

float intersect_sphere(vec3 O, vec3 D, vec3 S, float R) {
    float a = dot(D, D);
    vec3 OS = O - S;
    float b = 2. * dot(D, OS);
    float c = dot(OS, OS) - R * R;
    float disc = b * b - 4. * a * c;
    if (disc > 0.) {
        float distSqrt = sqrt(disc);
        float q = (-b - distSqrt) / 2.0;
        if (b >= 0.) {
            q = (-b + distSqrt) / 2.0;
        }
        float t0 = q / a;
        float t1 = c / q;
        t0 = min(t0, t1);
        t1 = max(t0, t1);
        if (t1 >= 0.) {
            if (t0 < 0.) {
                return t1;
            }
            else {
                return t0;
            }
        }
    }
    return INFINITY;
}

float intersect_plane(vec3 O, vec3 D, vec3 P, vec3 N) {
    float denom = dot(D, N);
    if (abs(denom) < 1e-6) {
        return INFINITY;
    }
    float d = dot(P - O, N) / denom;
    if (d < 0.) {
        return INFINITY;
    }
    return d;
}

vec3 run(float x, float y) {
    vec3 Q = vec3(x, y, 0.);
    vec3 D = normalize(Q - O);
    float t_plane, t0, t1;
    vec3 rayO = O;
    vec3 rayD = D;
    vec3 col = vec3(0.0, 0.0, 0.0);
    vec3 col_ray;
    float reflection = 1.;

    int object_index;
    vec3 object_color;
    vec3 object_normal;
    float object_reflection;
    vec3 M;
    vec3 N, toL, toO;

    for (int depth = 0; depth < 5; depth++) {

        /* start trace_ray */

        t_plane = intersect_plane(rayO, rayD, plane_position, plane_normal);
        t0 = intersect_sphere(rayO, rayD, sphere_position_0, sphere_radius_0);
        t1 = intersect_sphere(rayO, rayD, sphere_position_1, sphere_radius_1);

        if (t_plane < min(t0, t1)) {
            // Plane.
            M = rayO + rayD * t_plane;
            object_normal = plane_normal;
            // Plane texture.
            if (mod(floor(2.*M.x), 2.) == mod(floor(2.*M.z), 2.)) {
                object_color = vec3(1., 1., 1.);
            }
            else {
                object_color = vec3(0., 0., 0.);
            }
            object_reflection = .25;
            object_index = PLANE;
        }
        else if (t0 < t1) {
            // Sphere 0.
            M = rayO + rayD * t0;
            object_normal = normalize(M - sphere_position_0);
            object_color = sphere_color_0;
            object_reflection = .5;
            object_index = SPHERE_0;
        }
        else if (t1 < t0) {
            // Sphere 1.
            M = rayO + rayD * t1;
            object_normal = normalize(M - sphere_position_1);
            object_color = sphere_color_1;
            object_reflection = .5;
            object_index = SPHERE_1;
        }
        else {
            break;
        }

        N = object_normal;
        toL = normalize(light_position - M);
        toO = normalize(O - M);

        // Shadow of the spheres on the plane.
        if (object_index == PLANE) {
            t0 = intersect_sphere(M + N * .0001, toL,
                                  sphere_position_0, sphere_radius_0);
            t1 = intersect_sphere(M + N * .0001, toL,
                                  sphere_position_1, sphere_radius_1);
            if (min(t0, t1) < INFINITY) {
                break;
            }
        }

        col_ray = vec3(ambient, ambient, ambient);
        col_ray += light_intensity * max(dot(N, toL), 0.) * object_color;
        col_ray += light_specular.x * light_color *
            pow(max(dot(N, normalize(toL + toO)), 0.), light_specular.y);

        /* end trace_ray */

        rayO = M + N * .0001;
        rayD = normalize(rayD - 2. * dot(rayD, N) * N);
        col += reflection * col_ray;
        reflection *= object_reflection;
    }

    return clamp(col, 0., 1.);
}

void main() {
    vec2 pos = v_position;
    gl_FragColor = vec4(run(pos.x*u_aspect_ratio, pos.y), 1.);
}
`

class Canvas {
  constructor(element) {
    this.selfEl = $(element) || $(document.body);
    this.gl = this.selfEl[0].getContext('webgl');
    if (this.gl === null) {
      alert('Unable to initialize WebGL. Check to ensure WebGL is supported by your browser.');
      return;
    }
    this.vshader = null;
    this.fshader = null;
    this.program = null;
    this.positionBuffer = null;
    if (!this.initShaders()) {
      return;
    }
    if (!this.initProgram()) {
      return;
    }
    this.initBuffers();
    this.programInfo = {
      buffers: {
        position: this.positionBuffer,
      },
      attributes: {
        position: this.gl.getAttribLocation(this.program, 'a_position'),
      },
      uniforms: {
        aspectRatio: this.gl.getUniformLocation(this.program, 'u_aspect_ratio'),
        spherePosition0: this.gl.getUniformLocation(this.program, 'sphere_position_0'),
        spherePosition1: this.gl.getUniformLocation(this.program, 'sphere_position_1'),
        sphereRadius0: this.gl.getUniformLocation(this.program, 'sphere_radius_0'),
        sphereRadius1: this.gl.getUniformLocation(this.program, 'sphere_radius_1'),
        sphereColor0: this.gl.getUniformLocation(this.program, 'sphere_color_0'),
        sphereColor1: this.gl.getUniformLocation(this.program, 'sphere_color_1'),
        planePosition: this.gl.getUniformLocation(this.program, 'plane_position'),
        planeNormal: this.gl.getUniformLocation(this.program, 'plane_normal'),
        lightIntensity: this.gl.getUniformLocation(this.program, 'light_intensity'),
        lightSpecular: this.gl.getUniformLocation(this.program, 'light_specular'),
        lightPosition: this.gl.getUniformLocation(this.program, 'light_position'),
        lightColor: this.gl.getUniformLocation(this.program, 'light_color'),
        ambient: this.gl.getUniformLocation(this.program, 'ambient'),
        O: this.gl.getUniformLocation(this.program, 'O'),
      },
    };
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programInfo.buffers.position);
    this.gl.vertexAttribPointer(this.programInfo.attributes.position, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.programInfo.attributes.position),
    this.gl.uniform1f(this.programInfo.aspectRatio, this.gl.canvas.clientWidth/this.gl.canvas.clientHeight);
    this.gl.uniform3fv(this.programInfo.spherePosition0, [0.75, 0.1, 1.0]);
    this.gl.uniform1f(this.programInfo.sphereRadius0, 0.6);
    this.gl.uniform3fv(this.programInfo.sphereColor0, [0.0, 0.0, 1.0]);
    this.gl.uniform3fv(this.programInfo.spherePosition1, [-0.75, 0.1, 2.25]);
    this.gl.uniform1f(this.programInfo.sphereRadius1, 0.6);
    this.gl.uniform3fv(this.programInfo.sphereColor1, [0.5, 0.223, 0.5]);
    this.gl.uniform3fv(this.programInfo.planePosition, [0.0, -0.5, 0.0]);
    this.gl.uniform3fv(this.programInfo.planeNormal, [0.0, 1.0, 0.0]);
    this.gl.uniform1f(this.programInfo.lightIntensity, 1.0);
    this.gl.uniform2fv(this.programInfo.lightSpecular, [1.0, 50.0]);
    this.gl.uniform3fv(this.programInfo.lightPosition, [5.0, 5.0, -10.0]);
    this.gl.uniform3fv(this.programInfo.lightColor, [1.0, 1.0, 1.0]);
    this.gl.uniform1f(this.programInfo.ambient, 0.05);
    this.gl.uniform3fv(this.programInfo.O, [0.0, 0.0, -1.0]);
    this.gl.useProgram(this.program);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  initShaders() {
    let state = true;
    this.vshader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.fshader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(this.vshader, vertex);
    this.gl.shaderSource(this.fshader, fragment);
    this.gl.compileShader(this.vshader);
    this.gl.compileShader(this.fshader);
    if (!this.gl.getShaderParameter(this.vshader, this.gl.COMPILE_STATUS)) {
      alert('An error occured while compiling vertex shader:\n' + this.gl.getShaderInfoLog(vshader));
      this.gl.deleteShader(this.vshader);
      state = false;
    }
    if (!this.gl.getShaderParameter(this.fshader, this.gl.COMPILE_STATUS)) {
      alert('An error occured while compiling fragment shader:\n' + this.gl.getShaderInfoLog(fshader));
      this.gl.deleteShader(this.fshader);
      state = false;
    }
    return state;
  }

  initProgram() {
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, this.vshader);
    this.gl.attachShader(this.program, this.fshader);
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      alert('Error encountered while linking program:\n' + this.gl.getProgramInfoLog(this.program));
      return false;
    }
    return true;
  }

  initBuffers() {
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0,
      ]),
      this.gl.STATIC_DRAW
    );
  }
}
