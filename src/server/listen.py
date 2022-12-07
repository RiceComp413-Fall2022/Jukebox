"""Defines functions that allow front ends to subscribe to event announcements from the backend."""
from .messageAnnouncer import format_sse
from .announcer import announcers, SONG_QUEUE_EVENT, CURRENT_SONG_EVENT, QUEUE_CLOSED_EVENT
from .resources import queues

from flask import Response
import json

def stream(announcer, queue, userid="", testing=False):
    """
    Defines the stream to be used for server send events.

    Set testing to true if you would like the initial q to return and then for the connection to be closed.
    This option should not be used in prodcution.
    """
    messages = announcer.listen()  # returns a queue.Queue

    # tells the user the current state of the queue
    queue_contents = queue.get_all()
    json_data = [{
        "uri": song.uri,
        "upvotes": song.upvotes,
        "isOwnSong": True if song.user_id == userid else False,
        "upvotesByUser": song.upvotes_by_user[userid] if userid in song.upvotes_by_user else 0
    } for song in queue_contents]
    init_q = format_sse(json.dumps(json_data), SONG_QUEUE_EVENT)
    yield init_q

    song = queue.get_current()
    json_data = [{
        "uri": song.uri,
        "upvotes": song.upvotes,
        "isOwnSong": True if song.user_id == userid else False,
        "upvotesByUser": song.upvotes_by_user[userid] if userid in song.upvotes_by_user else 0
    }] if song is not None else None
    init_q = format_sse(json.dumps(json_data), CURRENT_SONG_EVENT)
    yield init_q

    if testing != 0:
        return

    while True:
        queue_is_open, queue_contents, current_song = messages.get()  # blocks until a new message arrives

        if not queue_is_open:
            yield format_sse("", QUEUE_CLOSED_EVENT)
            return
        else:
            json_data = [{
                "uri": song.uri,
                "upvotes": song.upvotes,
                "isOwnSong": True if song.user_id == userid else False,
                "upvotesByUser": song.upvotes_by_user[userid] if userid in song.upvotes_by_user else 0
            } for song in queue_contents]
            yield format_sse(json.dumps(json_data), SONG_QUEUE_EVENT)

            json_data = [{
                "uri": current_song.uri,
                "upvotes": current_song.upvotes,
                "isOwnSong": True if current_song.user_id == userid else False,
                "upvotesByUser": current_song.upvotes_by_user[userid] if userid in current_song.upvotes_by_user else 0
            }] if current_song is not None else None
            yield format_sse(json.dumps(json_data), CURRENT_SONG_EVENT)

def song_queue_listen(roomid, userid):
    """Listens for a song queue to be announced using server sent events."""
    queue = queues[roomid]
    announcer = announcers[roomid]

    # NOTE: Change the * to the domain to be more secure later
    return Response(stream(announcer, queue, userid=userid), mimetype='text/event-stream')
