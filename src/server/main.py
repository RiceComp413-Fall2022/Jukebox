from flask import Flask
from flask import request
import json

from server import config
from server import songqueue

app = Flask(__name__)


queue = songqueue.SongQueue()


class RequestHandlingException(Exception):
    """
    Custom exception type to be thrown by any method which runs into an issue handling the request from the front end.
    This exception should be caught to prevent server errors. When caught, relay the error to the front end.
    """
    def __init__(self, message):
        self.message = message

@app.route("/")
def hello_world():

    return "<p>Hello, World!</p>"


@app.route('/api/add_song', methods=['GET'])
def add_song():
    """

    :return:
    """

    request_bytes = request.data
    try:
        parsed = handle_request(request_bytes)

    except Exception as e:
        return str(e), config.REQUEST_ERROR_MESSAGE_CODE

    queue.add_song()

    return 0


@app.route('/api/remove_song', methods=['GET'])
def remove_song():
    """

    :return:
    """
    return 0


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
        raise RequestHandlingException("UserID not present in request.")






