# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in discountitem/__init__.py
from discountitem import __version__ as version

setup(
	name='discountitem',
	version=version,
	description='App for discount item',
	author='Ridhosribumi',
	author_email='develop@ridhosribumi.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
