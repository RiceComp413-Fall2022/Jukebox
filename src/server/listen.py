"""Defines functions that allow front ends to subscribe to event announcements from the backend."""
from .announcer import announcer, SONG_QUEUE_EVENT
from flask import Response

def song_queue_listen():
    """Listens for a song queue to be announced using server sent events."""
    def stream():
        messages = announcer.listen()  # returns a queue.Queue
        while True:
            msg = messages.get()  # blocks until a new message arrives
            # check if this message is about the song queue
            if f"event: {SONG_QUEUE_EVENT}" in msg:
                yield msg

    return Response(stream(), mimetype='text/event-stream')
