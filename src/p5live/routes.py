from p5live import app
from p5live.execute import execute
from flask import render_template, url_for, request, jsonify, json

@app.route('/')
def index ():
    return render_template('index.html')

@app.route('/_evaluate', methods=['POST'])
def _evaluate ():
    stmt = str(request.form.get('statement'))
    return jsonify({'output': execute(stmt).output})
