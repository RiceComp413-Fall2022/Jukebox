"""Defines the anouncer to use for the server sent events and also defines events that can be used consistently."""
import json

from .resources import announcers, queues

"""Event that sends a whole song queue to a listener."""

SONG_QUEUE_EVENT = 'song_queue'
QUEUE_CLOSED_EVENT = 'queue_closed'

def announce_song_queue(roomid):
    """Sends the current song queue to all listeners that are listening for the song_queue event as definded above."""
    queue = queues[roomid]
    announcer = announcers[roomid]

    queue_contents = queue.get_all()
    json_data = [{"uri": song.uri, "upvotes": song.upvotes} for song in queue_contents]

    announcer.announce(json.dumps(json_data), SONG_QUEUE_EVENT)

def announce_queue_close(roomid):
    """Announces to all listeners that the current song queue is being closed."""
    announcer = announcers[roomid]

    announcer.announce('', QUEUE_CLOSED_EVENT)
