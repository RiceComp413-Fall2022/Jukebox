"""Defines functions that allow front ends to subscribe to event announcements from the backend."""
from .messageAnnouncer import format_sse
from .announcer import announcer, SONG_QUEUE_EVENT
from .resources import queue

from flask import Response
import json

def stream(testing=False):
    """ 
    Defines the stream to be used for server send events

    Set testing to true if you would like the initial q to return and then for the connection to be closed.
    This option should not be used in prodcution.
    """
    messages = announcer.listen()  # returns a queue.Queue

    # tells the user the current state of the queue
    init_q = format_sse(json.dumps({'uris': [song_id for votes, song, song_id in queue.get_all()]}), SONG_QUEUE_EVENT)
    yield init_q

    if testing != 0:
        return
    
    while True:
        msg = messages.get()  # blocks until a new message arrives
        # check if this message is about the song queue
        if f"event: {SONG_QUEUE_EVENT}" in msg:
            yield msg

def song_queue_listen():
    """Listens for a song queue to be announced using server sent events."""
    # NOTE: Change the * to the domain to be more secure later
    return Response(stream(), mimetype='text/event-stream', headers={'Access-Control-Allow-Origin': "*"})
