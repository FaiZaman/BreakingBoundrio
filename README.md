# BreakingBoundrio

Welcome to BreakingBoundrio! This is an educational game where you have to use your knowledge to break boundries and win!

# Getting Started

To get started with the game, first clone the repo and `cd` into the directory:

```
git clone https://github.com/FaiZaman/BreakingBoundrio.git
cd BreakingBoundrio
```

# Setting up Flask environment

1. Create a virtual environment for the Flask dependancies (`virtualenv venv`)
2. Use `pip install -r requirements.txt` to install all Flask requirements.
3. In the app direcotry base, run `export FLASK_APP=wsgi.py` and optionally `export FLASK_ENV=development`. On Windows, use `set` instead of `export`.
4. Run `flask db init` to initialise the SQLAlchemy database if you haven't done so before. If you have, skip this step.
5. Run `flask db migrate` to generate database migrations, 
6. Run `flask db upgrade` to implement the migrations.
7. Use `flask run` to run the app.

# Migrating the database

When changes are made to the database models in our app, we need to run Flask-Migrate to apply those changes to the database. Use steps 3-6 above to carry out these migrations. If you get an error in step 5, delete the `migrations/` folder and the `app.db` file and try again.
