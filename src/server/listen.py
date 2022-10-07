"""Defines functions that allow front ends to subscribe to event announcements from the backend."""
from .messageAnnouncer import format_sse
from .announcer import announcer, SONG_QUEUE_EVENT
from .resources import queue

from flask import Response
import json

def song_queue_listen():
    """Listens for a song queue to be announced using server sent events."""
    def stream():
        messages = announcer.listen()  # returns a queue.Queue

        # tells the user the current state of the queue
        init_q = format_sse(json.dumps({'uris': [song_id for votes, song, song_id in queue.get_all()]}), SONG_QUEUE_EVENT)
        yield init_q

        while True:
            msg = messages.get()  # blocks until a new message arrives
            # check if this message is about the song queue
            if f"event: {SONG_QUEUE_EVENT}" in msg:
                yield msg

    return Response(stream(), mimetype='text/event-stream')
