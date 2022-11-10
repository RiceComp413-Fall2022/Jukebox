"""Main routines for the API server."""

from flask import Flask

from .routes import routes

app = Flask(__name__)
app.register_blueprint(routes)

@app.after_request
def handle_cors(response):
    """Prevent CORS issues for now."""
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response
