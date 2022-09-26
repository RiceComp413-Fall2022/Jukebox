'''
Defines functions that allow front ends to subscribe to event announcements from the backend.
'''
from flask import Response
from messageAnnouncer import SSEMessageAnnouncer

# TODO move this to its own file with the events defined, make everything more organized
announcer = SSEMessageAnnouncer()

def song_queue_listen():
    def stream():
        messages = announcer.listen()  # returns a queue.Queue
        while True:
            msg = messages.get()  # blocks until a new message arrives
            # check if this message is about the song queue
            if msg.contains("event: song_queue"):
                yield msg

    return Response(stream(), mimetype='text/event-stream')