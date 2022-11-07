"""Defines functions that allow front ends to subscribe to event announcements from the backend."""
from .messageAnnouncer import format_sse
from .announcer import announcers, SONG_QUEUE_EVENT, QUEUE_CLOSED_EVENT
from .resources import queues

from flask import Response
import json

def stream(announcer, queue, testing=False):
    """
    Defines the stream to be used for server send events.

    Set testing to true if you would like the initial q to return and then for the connection to be closed.
    This option should not be used in prodcution.
    """
    messages = announcer.listen()  # returns a queue.Queue

    # tells the user the current state of the queue
    init_q = format_sse(json.dumps({'uris': [song.uri for song in queue.get_all()]}), SONG_QUEUE_EVENT)
    yield init_q

    if testing != 0:
        return

    while True:
        msg = messages.get()  # blocks until a new message arrives
        # check if this message is about the song queue
        if f"event: {SONG_QUEUE_EVENT}" in msg:
            yield msg
        if f"event: {QUEUE_CLOSED_EVENT}" in msg:
            yield msg
            return

def song_queue_listen(roomid):
    """Listens for a song queue to be announced using server sent events."""
    queue = queues[roomid]
    announcer = announcers[roomid]

    # NOTE: Change the * to the domain to be more secure later
    return Response(stream(announcer, queue), mimetype='text/event-stream', headers={'Access-Control-Allow-Origin': "*"})
