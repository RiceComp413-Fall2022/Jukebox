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

@routes.route("/songQueueCreate", methods=['GET'])
def song_q_create():
    """API endpoint client should use to create a new room/songqueue."""
    pass

@routes.route("/songQueueDestroy", methods=['GET'])
def song_q_destroy():
    """API endpoint client should use to destroy a room/songqueue."""
    pass

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
    return f"Sucessuflly added song uri: {s.uri}", 200

@routes.route("/removeSong", methods=['GET'])
def song_remove():
    """API endpoint client should use to remove songs from the song queue."""
    args = request.args
    if 'uri' not in args:
        return "Song URI not present in request.", 400

    if 'userid' not in args:
        return "User ID not present in reqeust.", 400

    announce_song_queue()
    return "", 200

@routes.route("/upvoteSong", methods=['GET'])
def song_upvote():
    """API endpoint client should use to upvote songs in the song queue."""
    pass

@routes.route("/downvoteSong", methods=['GET'])
def song_downvote():
    """API endpoint client should use to downvote songs in the song queue."""
    pass

@routes.route("/getTopSong", methods=['GET'])
def song_get_top():
    """API endpoint client should use to get the top song from the song queue."""
    pass

@routes.route("/removeTopSong", methods=['GET'])
def song_remove_top():
    """API endpoint client should use to get the top song from the song queue."""
    pass
