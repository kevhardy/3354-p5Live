from io import StringIO
from contextlib import redirect_stdout
from collections import namedtuple
import sys
import traceback
import unittest

ExecOut = namedtuple('ExecOut', ['output', 'noexcept'])

def execute (stmt):
    noexcept = True
    out = StringIO()
    try:
        with redirect_stdout(out):
            text = eval(stmt)
            if text:
                print(text)
    except:
        noexcept = False
        etype, value, tb = sys.exc_info()
        if tb.tb_next is not None:
            tb = tb.tb_next
        text = traceback.format_exception(etype, value, tb)
        out.write(''.join(text))
    return ExecOut(out.getvalue(), noexcept)

class TestExecute (unittest.TestCase):
    test_stmts = []
    try:
        with open('test_stmts.py', 'r') as stmts:
            for stmt in stmts:
                test_stmts.append(stmt.rstrip())
    except: pass

    def test_noexcept (self):
        for stmt in self.test_stmts:
            res = execute(stmt)
            with self.subTest(stmt=stmt):
                self.assertIsNotNone(res, 'execute returned \'None\'')
                self.assertTrue(res.noexcept,
                        'statement threw an exception\n\t {}'.format(stmt))

if __name__ == '__main__':
    unittest.main()
