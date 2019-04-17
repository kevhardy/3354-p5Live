# Comparative Research (SymPy-Live vs. p5Live)
### By: Garret Fox

## Introduction

  For our project we have chosen p5Live as our live-coding environment tool,
as it is a simplistic and fun way to introduce oneself to the versitile language of Python.

  This document will focus on the key differences as well as the similarities between p5Live
and another live-coding python environment tool: SymPy.

## p5Live Main Features

- Based in Python programming language

- Graphical live-coding enironment tool 

- User-interface for immediate feedback

- Free

## SymPy Live Main Features

- Based in Python programming language

- Mathematical live-coding environment tool

- Full featured computer algebra system (CAS)

- Basic Python shell interface

- Free

## Functional Differences

### SymPy Live

SymPy is used primarily as an interactive tool that models simple and highly complicated mathematical models, and can also be used as an auxiliary tool in addition to another main program in case the need for complicated math arises.[1]

SymPy Live utilizes the Google App Machine (GAM) to handle interactions between the user and the website. GAM is a serverless application platform, allowing developers to not worry themselves with managing underlying server infrastructure. This reduces the overhead of the developer and allows for a more productive development.[7]

Within the SymPy site itself, the user can enter various commands and functions, declare variables, and evaluate expressions. It is based in a regular Python shell, with some commands being executed by default:[2]

```python
from __future__ import division
from sympy import *

x, y, z, t = symbols('x y z t')
k, m, n = symbols('k m n', integer=True)
f, g, h = symbols('f g h', cls=Function)
```

### p5Live

p5Live is used to create interesting designs and geometric animations in various different ways. It was designed to be a python implementation of the processing API. It is designed to be an easy way for beginning python programmers to design and utilize high-level functions that would normally dissuade them from attempting interesting projects.[6]  

p5Live's utility relies upon it's draw() function. After the user defines the function, the p5Live server calls it repeatedly, which then displays the image the user defines onto the interactive user interface. There are specialized functions that allow the user to draw various kinds of shapes, such as squares, circles, as well as the use of tuples, lists, and vectors to aid in the allocation of coordinates in space. This required a change in the original Processing API so that these could be used by default. 

The support for the live coding of sketches is made possible through the python REPL, a Read-Evaluate-Print loop. 

The user is also able to upload images, as well as having support for texts and fonts.[5]

## Works Cited:

[1] https://marketplace.visualstudio.com/itemdetails?itemName=filipesabella.live-p5

[2] https://www.sympy.org/en/index.html

[3] http://scipy-lectures.org/advanced/sympy.html

[4] https://github.com/yangsu/p5-live/tree/master/sketches/waves

[5] https://medium.com/processing-foundation/p5-a-python-implementation-of-the-processing-api-5f05c62db23b

[6] https://cloud.google.com/appengine/
