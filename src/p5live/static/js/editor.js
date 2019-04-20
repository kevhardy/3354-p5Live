'use strict'

const defaultText = `
# Fake example program
program = p5.Program(vertex, fragment)
program['a_position'] = [(-1., -1.), (-1., +1.), (+1., -1.), (+1., +1.)]
program['sphere_position_0'] = (.75, .1, 2.0 + cos(4*program.elapsed))
program['sphere_radius_0'] = .6
program['sphere_color_0'] = (0., 0., 1.)

program['sphere_position_1'] = (-.75, .1, 2.0 - cos(4*program.elapsed))
program['sphere_radius_1'] = .6
program['sphere_color_1'] = (.5, .223, .5)

program['plane_position'] = (0., -.5, 0.)
program['plane_normal'] = (0., 1., 0.)

program['light_intensity'] = 1.
program['light_specular'] = (1., 50.)
program['light_position'] = (5., 5., -10.)
program['light_color'] = (1., 1., 1.)
program['ambient'] = .05
program['O'] = (0., 0., -1.)

width, height = self.size
p5.set_viewport(0, 0, *self.physical_size)
program['u_aspect_ratio'] = width/float(height)

show()
`

class Editor {
  constructor(element) {
    this.selfEl = $(element) || $(document.body);
    this.inputEl = $('<textarea/>').
      addClass('editor-input').
      attr({
        // rows: '40',
        spellcheck: 'false',
        autocorrect: 'off',
        autocapitalize: 'off'
      }).
      html(defaultText);
    this.consoleEl = $('<div/>').
      addClass('editor-console');
    this.runEl = $('<button/>').
      addClass('editor-run').
      html('Run');
    this.outputEl = $('<div/>').
      addClass('editor-output').
      attr({
        rows: '10',
        readonly: 'readonly'
      });
    this.inputEl.on('focus', function(event) {
      event.stopPropagation();
      event.preventDefault();
      this.focus();
    });
    this.runEl.click($.proxy(function(event) {
      event.stopPropagation();
      event.preventDefault();
      this.evaluate();
      return true;
    }, this)
    );

    this.consoleEl.append(this.runEl);
    this.consoleEl.append(this.outputEl);
    this.selfEl.append(this.inputEl);
    this.selfEl.append(this.consoleEl);
  }

  get input() {
    return this.inputEl.val();
  }

  set input(value) {
    return this.inputEl.val(value);
  }

  get output() {
    return this.outputEl.text();
  }

  focus() {
    this.inputEl.focus();
  }

  appendOutput(text) {
    let textEl = $('<div/>').text(text);
    this.outputEl.append(textEl);
    this.outputEl.scrollTop(this.outputEl[0].scrollHeight);
  }

  evaluate() {
    let data = {
      code: this.input,
    }

    $.ajax({
      type: 'POST',
      url: '/_evaluate',
      timeout: 60000,
      data: data,
      success: $.proxy(function(response) {
        this.appendOutput(response.output);
        this.focus();
      }, this),
    });
  }
}
