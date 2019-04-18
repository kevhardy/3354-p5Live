from io import StringIO
from contextlib import redirect_stdout
import sys
import traceback

def execute (stmt):
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
    return out.getvalue()
