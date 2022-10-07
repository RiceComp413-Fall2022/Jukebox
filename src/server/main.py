"""Main routines for the API server."""

from flask import Flask

from .routes import routes

app = Flask(__name__)
app.register_blueprint(routes)
