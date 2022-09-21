python -m pip install --upgrade pip
pip install flake8
pip install flake8-docstrings
pip install -r src/server/requirements.txt
flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
flake8 . --count --ignore=E302,E303,E261 --max-complexity=10 --max-line-length=127 --statistics
python -m unittest discover test/server
