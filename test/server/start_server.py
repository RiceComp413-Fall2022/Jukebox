"""Starts flask server."""
from main import app

def start():
    """Start server on localhost, port 5000. For testing purposes."""
    app.run(host='127.0.0.1', port='5000', debug=False)
