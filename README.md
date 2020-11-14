# BreakingBoundrio

Welcome to BreakingBoundrio! This is an educational game where you have to use your knowledge to break boundries and win!

# Getting Started

To get started with the game, first clone the repo and `cd` into the directory:

```
git clone https://github.com/FaiZaman/BreakingBoundrio.git
cd BreakingBoundrio
```

# Setting up Flask environment

1. Create a virtual environment for the Flask dependancies (`virtualenv venv`)
2. Use `pip install -r requirements.txt` to install all Flask requirements.
3. In the app direcotry base, run `export FLASK_APP=wsgi.py` and optionally `export FLASK_ENV=development`. On Windows, use `set` instead of `export`.
4. Use `flask run` to run the app.