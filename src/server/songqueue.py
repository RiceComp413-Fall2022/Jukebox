"""Routines related to song queue manangement."""

import heapq
import threading
import itertools

class SongQueue:
    """A song queue which can keep track of song rankings according to upvotes/downvotes."""

    def __init__(self):
        """Create an empty song queue containing no songs. self.counter is monotonic to maintain insertion ordering."""
        self.pq = []
        self.lock = threading.Lock()
        self.counter = itertools.count()
        self.entries_by_song = {}

    def __len__(self):
        """Return the number of songs in the queue."""
        with self.lock:
            return len(self.pq)

    def add_song(self, song_data, song_identifier=None):
        """Add a song data object with zero votes.

        A separate identifier can optionally be provided for use during lookup for voting.
        Returns True if the song did not exist yet (by identifier) and was added.
        Return False if the song identifier already existed and the add was treated as an upvote.
        """
        song_identifier = song_data if song_identifier is None else song_identifier
        with self.lock:
            if song_identifier in self.entries_by_song:
                self.entries_by_song[song_identifier][0] -= 1 # Upvote if identifier already exists
                heapq.heapify(self.pq)
                return False
            else:
                count = next(self.counter)
                entry = [0, count, song_data, song_identifier]
                self.entries_by_song[song_identifier] = entry
                heapq.heappush(self.pq, entry)
                return True

    def update_song(self, song_identifier, new_votes):
        """Completely replace the number of votes that a song has with new_votes."""
        with self.lock:
            entry = self.entries_by_song[song_identifier]
            entry[0] = -new_votes
            heapq.heapify(self.pq)

    def upvote_song(self, song_identifier):
        """Increment the number of votes that a song has. Internally, this means decreasing its priority."""
        with self.lock:
            entry = self.entries_by_song[song_identifier]
            entry[0] -= 1
            heapq.heapify(self.pq)

    def downvote_song(self, song_identifier):
        """Increment the number of votes that a song has. Internally, this means increasing its priority."""
        with self.lock:
            entry = self.entries_by_song[song_identifier]
            entry[0] += 1
            heapq.heapify(self.pq)

    def remove_top(self):
        """Remove the top song in the queue and return a tuple (votes, song_data, song_identifier)."""
        with self.lock:
            while self.pq:
                priority, count, song_data, song_identifier = heapq.heappop(self.pq)
                del self.entries_by_song[song_identifier]
                return (-priority, song_data, song_identifier)
            return None

    def get_top(self, n):
        """Return a list of tuples (votes, song_data, song_identifier) for the top n songs in the queue, without removing."""
        with self.lock:
            ret = []
            for priority, count, song_data, song_identifier in heapq.nsmallest(n, self.pq):
                ret.append((-priority, song_data, song_identifier))
            return ret
