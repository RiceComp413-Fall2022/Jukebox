"""Defines the anouncer to use for the server sent events and also defines events that can be used consistently."""
from messageAnnouncer import SSEMessageAnnouncer

announcer = SSEMessageAnnouncer()

"""Event that sends a whole song queue to a listener."""
SONG_QUEUE_EVENT = 'song_queue'

def announce_song_queue():
    """Sends the current song queue to all listeners that are listening for the song_queue event as definded above."""

    """TODO replace with real song queue to send to clients."""
    song_q = 'Test song queue'
    announcer.announce(song_q, SONG_QUEUE_EVENT)
