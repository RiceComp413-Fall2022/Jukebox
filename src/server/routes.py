"""Defines the routes for the Unorthadox Jukebox API and calls the proper function to execute."""
import time
from flask import Blueprint
from flask import request

from .announcer import announce_song_queue
from .listen import song_queue_listen
from .resources import queue
from .songqueue import Song
from .validator import validate_uri

routes = Blueprint('routes', __name__)

@routes.route("/songQueueListen", methods=['GET'])
def song_q_listen():
    """API endpoint client should use to listen for song queues."""
    return song_queue_listen()

@routes.route("/addSong", methods=['GET'])
def song_add():
    """API endpoint client should use to add songs to the song queue."""
    # add song to song queue here
    args = request.args
    if 'uri' not in args:
        return "Song URI not present in request.", 400

    if 'userid' not in args:
        return "User ID not present in request.", 400

    if not validate_uri(args['uri']):
        return "Invalid song URI", 400

    s = Song(args['uri'], args['userid'], time.time())
    queue.add_song(s, s.uri)

    # then send updated song queue to everyone
    announce_song_queue()
    return {"result": "Song successfully added"}, 200
