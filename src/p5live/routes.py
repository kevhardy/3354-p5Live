from p5live import app
from flask import render_template, url_for, request, jsonify, json
from io import StringIO
from contextlib import redirect_stdout
import sys
import traceback

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/_evaluate', methods=['POST'])
def _evaluate():
    stmt = str(request.form.get('statement'))
    out = StringIO()
    try:
        with redirect_stdout(out):
            text = eval(stmt)
            if text:
                print(text)
    except:
        etype, value, tb = sys.exc_info()
        if tb.tb_next is not None:
            tb = tb.tb_next
        text = traceback.format_exception(etype, value, tb)
        out.write(''.join(text))
    return jsonify({'output': out.getvalue()})
