from p5live import app
from p5live.execute import execute
from flask import render_template, url_for, request, jsonify, json
from io import StringIO

@app.route('/')
def index ():
    return render_template('index.html')

@app.route('/_evaluate', methods=['POST'])
def _evaluate ():
    code = str(request.form.get('code'))
    out = StringIO()
    for stmt in code.split('\n'):
        stmt = stmt.rstrip()
        if (stmt):
            execute(stmt, out)
    return jsonify({'output': out.getvalue()})
