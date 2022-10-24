"""Defines the anouncer to use for the server sent events and also defines events that can be used consistently."""
import json

from .resources import announcers, queues

"""Event that sends a whole song queue to a listener."""
SONG_QUEUE_EVENT = 'song_queue'

def announce_song_queue(roomid):
    """Sends the current song queue to all listeners that are listening for the song_queue event as definded above."""
    queue = queues[roomid]
    announcer = announcers[roomid]

    song_id_list = [song_id for votes, song, song_id in queue.get_all()]

    announcer.announce(json.dumps({'uris': song_id_list}), SONG_QUEUE_EVENT)
