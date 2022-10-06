"""Defines the routes for the Unorthadox Jukebox API and calls the proper function to execute."""
from flask import Blueprint
from .announcer import announce_song_queue
from .listen import song_queue_listen

routes = Blueprint('routes', __name__)

@routes.route("/songQueueListen", methods=['GET'])
def song_q_listen():
    """API endpoint client should use to listen for song queues."""
    return song_queue_listen()

@routes.route("/addSong", methods=['GET'])
def song_add():
    """API endpoint client should use to add songs to the song queue."""
    # would add song to song queue here

    # then send updated song queue to everyong
    announce_song_queue()
    return {}, 200
