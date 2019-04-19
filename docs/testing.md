## Test Planning

p5Live is split into three modules: the editor, the console, and the canvas.
The editor in this context will also include the execution of Python code on the server.
Both the console and the canvas depend on the editor to act as their source of data; the console will require error outputs and tracebacks from the execution of the user's code, and the canvas will require the vertex and index buffers from the p5 backend.

However, the primary functionality of all three modules themselves do not necessarily depend on each other beyond this, and to that end, testing will be done with predefined inputs as test cases rather than with inputs provided by the editor.
We therefore intend to implement a bottom-up strategy for integration testing.

### Editor Unit Test &mdash; The `execute()` method

The unit we chose to implement for testing is our `execute()` method.
This function is called with a string as a parameter that represents a line that is to be interpreted as a Python statement to be run.

The code is as follows:
```python
from io import StringIO
from contextlib import redirect_stdout
from collections import namedtuple
import sys
import traceback

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
```
The `noexcept` variable is used to identify whether or not the statement that was passed threw an exception when executed.

To test this function, we designed a test case that tests what kinds of statements throw an exception:
```python
import unittest

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
```
This code will load the statements to be tested from a file named `test_stmts.py` and send each through a call to `execute()`.

As an example, given the following contents of `test_stmts.py`:
```python
10+2
a = 2
print('hello')
1024**2
x = 2
4096*2+(3+4)*16
```
`TestExecute` produces the output:
```
======================================================================
FAIL: test_noexcept (__main__.TestExecute) (stmt='a = 2')
----------------------------------------------------------------------
Traceback (most recent call last):
  File "execute.py", line 41, in test_noexcept
    'statement threw an exception\n\t {}'.format(stmt))
AssertionError: False is not true : statement threw an exception
     a = 2

======================================================================
FAIL: test_noexcept (__main__.TestExecute) (stmt='x = 2')
----------------------------------------------------------------------
Traceback (most recent call last):
  File "execute.py", line 41, in test_noexcept
    'statement threw an exception\n\t {}'.format(stmt))
AssertionError: False is not true : statement threw an exception
     x = 2

----------------------------------------------------------------------
Ran 1 test in 0.001s

FAILED (failures=2)
```
