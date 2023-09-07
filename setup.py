from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in blogadmin/__init__.py
from blogadmin import __version__ as version

setup(
	name="blogadmin",
	version=version,
	description="For the admin who would like to create blogs",
	author="mark",
	author_email="mark@mail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
