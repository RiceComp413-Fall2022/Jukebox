"""Main routines for the API server."""

from flask import Flask
from flask import request
import json

from .config import REQUEST_ERROR_MESSAGE_CODE
from .resources import queue, RequestHandlingException
from .routes import routes

app = Flask(__name__)
app.register_blueprint(routes)

@app.route('/remove_song', methods=['GET', 'POST'])
def remove_song():
    """Removes a song form the queue for a client."""

    request_bytes = request.data
    try:
        parsed = handle_request(request_bytes)
    except RequestHandlingException as e:
        return str(e), REQUEST_ERROR_MESSAGE_CODE

    votes, song_data, song_identifier = queue.get_song(parsed['uri'])
    if song_data.requestee == parsed['userID']:
        queue.remove_song(parsed['uri'])

    return json.dumps({'success': True}), 200

def handle_request(request_bytes):
    """
    Check for the basics necessary for all requests, specifically a song URI is and a user id.

    :param request_bytes:
    :return:
    """
    try:
        parsed = json.loads(request_bytes)
    except json.JSONDecodeError as e:
        raise RequestHandlingException("Error while converting request to JSON:\n" + str(e))

    if "uri" not in parsed:
        raise RequestHandlingException("Song URI not present in request.")

    if "userid" not in parsed:
        raise RequestHandlingException("User ID not present in request.")

    return parsed
