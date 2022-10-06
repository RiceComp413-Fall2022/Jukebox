"""Main routines for the API server."""

from flask import Flask
from flask import request
import json
import time

from server import config
from server import songqueue

app = Flask(__name__)

def update_votes(data, new_votes):
    data.upvotes = new_votes
queue = songqueue.SongQueue(update_data_funct=update_votes)

class RequestHandlingException(Exception):
    """
    Custom exception type to be thrown by any method which runs into an issue handling the request from the front end.

    This exception should be caught to prevent server errors. When caught, relay the error to the front end.
    """

    def __init__(self, message):
        """Set the message."""
        self.message = message

@app.route('/add_song', methods=['GET', 'POST'])
def add_song():
    """Adds a song to the queue for a client."""

    request_bytes = request.data
    try:
        parsed = handle_request(request_bytes)
    except Exception as e:
        return str(e), config.REQUEST_ERROR_MESSAGE_CODE

    s = songqueue.Song(parsed['uri'], parsed['userid'], time.time())
    queue.add_song(s, song_identifier=parsed['uri'])

    return json.dumps({'success': True}), 200

@app.route('/remove_song', methods=['GET', 'POST'])
def remove_song():
    """Removes a song form the queue for a client."""

    request_bytes = request.data
    try:
        parsed = handle_request(request_bytes)
    except RequestHandlingException as e:
        return str(e), config.REQUEST_ERROR_MESSAGE_CODE

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
