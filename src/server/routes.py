"""Defines the routes for the Unorthodox Jukebox API and calls the proper function to execute."""
from flask import Blueprint
from flask import request

from .announcer import announce_song_queue, announce_queue_close
from .listen import song_queue_listen
from .resources import queues, announcers
from .songqueue import SongQueue
from .validator import validate_uri
from .messageAnnouncer import SSEMessageAnnouncer

routes = Blueprint('routes', __name__)

@routes.route("/songQueueCreate", methods=['GET'])
def song_q_create():
    """API endpoint client should use to create a new room/songqueue."""
    args = request.args

    if 'userid' not in args:
        return "User ID not present in request.", 400

    if 'roomid' not in args:
        return "Room ID not present in request.", 400

    if args['roomid'] in queues:
        return "Room ID already exists.", 400

    queues[args['roomid']] = SongQueue(args['userid'])
    announcers[args['roomid']] = SSEMessageAnnouncer()

    return "Successfully created song queue", 200

@routes.route("/songQueueDestroy", methods=['GET'])
def song_q_destroy():
    """API endpoint client should use to destroy a room/songqueue."""
    args = request.args

    if 'userid' not in args:
        return "User ID not present in request.", 400

    if 'roomid' not in args:
        return "Room ID not present in request.", 400

    if args['roomid'] not in queues:
        return "Room ID does not exist.", 400

    if args['userid'] != queues[args['roomid']].primary_user_id:
        return "Failed to destroy queue", 400

    announce_queue_close(args['roomid'])
    del queues[args['roomid']]
    del announcers[args['roomid']]

    return "Successfully destroyed song queue", 200

@routes.route("/songQueueListen", methods=['GET'])
def song_q_listen():
    """API endpoint client should use to listen for updates to the queue."""
    args = request.args

    if 'roomid' not in args:
        return "Room ID not present in request.", 400

    if not args['roomid'] in queues:
        return "Invalid room ID", 400

    """API endpoint client should use to listen for song queues."""
    return song_queue_listen(args['roomid'])

@routes.route("/addSong", methods=['GET'])
def song_add():
    """API endpoint client should use to add songs to the song queue."""
    # add song to song queue here
    args = request.args

    if 'uri' not in args:
        return "Song URI not present in request.", 400

    if 'userid' not in args:
        return "User ID not present in request.", 400

    if 'roomid' not in args:
        return "Room ID not present in request.", 400

    if not validate_uri(args['uri']):
        return "Invalid song URI", 400

    if not args['roomid'] in queues:
        return "Invalid room ID", 400

    result = queues[args['roomid']].add_song(args['userid'], args['uri'])

    # then send updated song queue to everyone
    announce_song_queue(args['roomid'])

    if result:
        return "Successfully added song", 200
    else:
        return "Failed to add song", 400

@routes.route("/removeSong", methods=['GET'])
def song_remove():
    """API endpoint client should use to remove songs from the song queue."""
    args = request.args
    if 'uri' not in args:
        return "Song URI not present in request.", 400

    if 'userid' not in args:
        return "User ID not present in reqeust.", 400

    if 'roomid' not in args:
        return "Room ID not present in request.", 400

    if not args['roomid'] in queues:
        return "Invalid room ID", 400

    result = queues[args['roomid']].remove_song(args['userid'], args['uri'])
    announce_song_queue(args['roomid'])

    if result:
        return "Successfully removed song", 200
    else:
        return "Failed to remove song", 400

@routes.route("/upvoteSong", methods=['GET'])
def song_upvote():
    """API endpoint client should use to upvote songs in the song queue."""
    args = request.args

    if 'uri' not in args:
        return "Song URI not present in request.", 400

    if 'userid' not in args:
        return "User ID not present in request.", 400

    if 'roomid' not in args:
        return "Room ID not present in request.", 400

    if not args['roomid'] in queues:
        return "Invalid room ID", 400

    result = queues[args['roomid']].upvote_song(args['userid'], args['uri'])
    announce_song_queue(args['roomid'])

    if result:
        return "Successfully upvoted song", 200
    else:
        return "Failed to upvote song", 400

@routes.route("/downvoteSong", methods=['GET'])
def song_downvote():
    """API endpoint client should use to downvote songs in the song queue."""
    args = request.args

    if 'uri' not in args:
        return "Song URI not present in request.", 400

    if 'userid' not in args:
        return "User ID not present in request.", 400

    if 'roomid' not in args:
        return "Room ID not present in request.", 400

    if not args['roomid'] in queues:
        return "Invalid room ID", 400

    result = queues[args['roomid']].downvote_song(args['userid'], args['uri'])
    announce_song_queue(args['roomid'])

    if result:
        return "Successfully upvoted song", 200
    else:
        return "Failed to upvote song", 400
