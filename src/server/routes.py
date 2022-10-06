"""Defines the routes for the Unorthadox Jukebox API and calls the proper function to execute."""
import time
from flask import Blueprint
from flask import request

from .announcer import announce_song_queue
from .listen import song_queue_listen
from .resources import RequestHandlingException, queue
from .songqueue import Song

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
        raise RequestHandlingException("Song URI not present in request.")

    if 'userid' not in args:
        raise RequestHandlingException("User ID not present in request.")

    s = Song(args['uri'], args['userid'], time.time())
    queue.add_song(s, s.uri)

    # then send updated song queue to everyone
    announce_song_queue()
    return {}, 200
