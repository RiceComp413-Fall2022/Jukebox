"""Defines the routes for the Unorthodox Jukebox API and calls the proper function to execute."""
from flask import Blueprint
from flask import request

from .announcer import announce_song_queue, announce_queue_close
from .listen import song_queue_listen
from .resources import queues, announcers
from .songqueue import SongQueue
from .validator import validate_uri
from .messageAnnouncer import SSEMessageAnnouncer

from .config import SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
import requests
import base64
import json
import time
import threading

routes = Blueprint('routes', __name__)

s = requests.Session()

at = None

def refresh_token():
    """Refresh the Spotify access token every 50 minutes."""
    global at

    while True:
        headers = {
            "Authorization": b"Basic " + base64.b64encode((SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).encode()),
            "Content-Type": "application/x-www-form-urlencoded"
        }
        res = s.post("https://accounts.spotify.com/api/token", headers=headers, data="grant_type=client_credentials")
        at = json.loads(res.text)["access_token"]
        time.sleep(3000)


t = threading.Thread(target=refresh_token)
t.daemon = True
t.start()

@routes.route("/songQueueCreate", methods=['GET'])
def song_q_create():
    """
    API endpoint client should use to create a new room/songqueue.

    Required Params:
        userid: id of user creating the queue (primary user)
        roomid: id fo the room being created, should be unique
    """
    args = request.args

    if 'userid' not in args:
        return "User ID not present in request.", 400

    if 'roomid' not in args:
        return "Room ID not present in request.", 400

    if args['roomid'].strip().lower() in queues:
        return "Room ID already exists.", 400

    queues[args['roomid'].strip().lower()] = SongQueue(args['userid'])
    announcers[args['roomid'].strip().lower()] = SSEMessageAnnouncer()

    return "Successfully created song queue", 200

@routes.route("/songQueueDestroy", methods=['GET'])
def song_q_destroy():
    """API endpoint client should use to destroy a room/songqueue."""
    args = request.args

    if 'userid' not in args:
        return "User ID not present in request.", 400

    if 'roomid' not in args:
        return "Room ID not present in request.", 400

    if args['roomid'].strip().lower() not in queues:
        return "Room ID does not exist.", 400

    if args['userid'] != queues[args['roomid'].strip().lower()].primary_user_id:
        return "Failed to destroy queue", 400

    announce_queue_close(args['roomid'].strip().lower())
    del queues[args['roomid'].strip().lower()]
    del announcers[args['roomid'].strip().lower()]

    return "Successfully destroyed song queue", 200

@routes.route("/songQueueListen", methods=['GET'])
def song_q_listen():
    """
    API endpoint client should use to listen for updates to the queue.

    Required params:
        roomid: the room id of the song queue to listen to.
    """
    args = request.args

    if 'roomid' not in args:
        return "Room ID not present in request.", 400

    if not args['roomid'].strip().lower() in queues:
        return "Invalid room ID", 400

    userid = args['userid'] if 'userid' in args else ""

    """API endpoint client should use to listen for song queues."""
    return song_queue_listen(args['roomid'].strip().lower(), userid)

@routes.route("/addSong", methods=['GET'])
def song_add():
    """
    API endpoint client should use to add songs to the song queue.

    Required Params:
        userid: id of user adding to the queue
        roomid: room id of the queue to add to
        uri:    uri of the song to add to the queue
    """
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

    if not args['roomid'].strip().lower() in queues:
        return "Invalid room ID", 400

    result = queues[args['roomid'].strip().lower()].add_song(args['userid'], args['uri'])

    # then send updated song queue to everyone

    announce_song_queue(args['roomid'].strip().lower())

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

    if not args['roomid'].strip().lower() in queues:
        return "Invalid room ID", 400

    result = queues[args['roomid'].strip().lower()].remove_song(args['userid'], args['uri'])
    announce_song_queue(args['roomid'].strip().lower())

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

    if not args['roomid'].strip().lower() in queues:
        return "Invalid room ID", 400

    result = queues[args['roomid'].strip().lower()].upvote_song(args['userid'], args['uri'])
    announce_song_queue(args['roomid'].strip().lower())

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

    if not args['roomid'].strip().lower() in queues:
        return "Invalid room ID", 400

    result = queues[args['roomid'].strip().lower()].downvote_song(args['userid'], args['uri'])
    announce_song_queue(args['roomid'].strip().lower())

    if result:
        return "Successfully upvoted song", 200
    else:
        return "Failed to upvote song", 400

@routes.route("/stepCurrent", methods=['GET'])
def step_current():
    """API endpoint client should use to step the current song."""
    args = request.args

    if 'userid' not in args:
        return "User ID not present in request.", 400

    if 'roomid' not in args:
        return "Room ID not present in request.", 400

    if not args['roomid'].strip().lower() in queues:
        return "Invalid room ID", 400

    result = queues[args['roomid'].strip().lower()].step_current(args['userid'])
    announce_song_queue(args['roomid'].strip().lower())

    if result:
        return "Successfully updated current song", 200
    else:
        return "Failed to update current song", 400

@routes.route("/search", methods=['GET'])
def search():
    """API endpoint client should use to search for songs."""
    args = request.args

    if 'q' not in args:
        return "Search query not present in request.", 400

    headers = {
        "Authorization": "Bearer " + at,
        "Content-Type": "application/json"
    }

    res = s.get("https://api.spotify.com/v1/search?q=" + args['q'] + "&type=track&limit=5", headers=headers)
    if res.status_code != 200:
        return "Failed to perform search due to Spotify search error", 400

    return res.text, 200

@routes.route("/tracks", methods=['GET'])
def tracks():
    """API endpoint client should use to get track info."""
    args = request.args

    if 'ids' not in args:
        return "IDs not present in request.", 400

    headers = {
        "Authorization": "Bearer " + at,
        "Content-Type": "application/json",
    }

    res = s.get("https://api.spotify.com/v1/tracks?ids=" + args['ids'], headers=headers)
    if res.status_code != 200:
        return "Failed to perform track lookup due to Spotify API error", 400

    return res.text, 200
