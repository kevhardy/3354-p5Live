from distutils.core import setup
from pathlib import Path

setup(
        name='p5live',
        description="""
            Online interpreter for the p5py module.
            """,
        long_description=open(str(Path('../README.md'))).read(),
        version='0.1-dev',
        packages=['p5live',],
        install_requires=['flask'],
        )
