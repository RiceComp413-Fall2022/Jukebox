set -e
python -m pip install --upgrade pip
python -m pip install flake8
python -m pip install flake8-docstrings
python -m pip install -r src/server/requirements.txt
python -m flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
python -m flake8 . --count --ignore=E302,E303,E261,D202,D401 --max-complexity=10 --max-line-length=128 --statistics
JDIR=$(pwd)
python -m pytest ./test/server/
cd src/server
python -m unittest discover -t $JDIR -s $JDIR/test/server
cd $JDIR
