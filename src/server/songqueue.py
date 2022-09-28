"""Routines related to song queue manangement."""

import heapq
import threading
import itertools


class SongQueue:
    """A song queue which can keep track of song rankings according to upvotes/downvotes."""

    def __init__(self, update_data_funct=lambda data, new_votes: None):
        """Create an empty song queue containing no songs. self.counter is monotonic to maintain insertion ordering."""
        self.pq = []
        self.lock = threading.Lock()
        self.counter = itertools.count()
        self.entries_by_song = {}
        self.update_data_funct = update_data_funct

    def __len__(self):
        """Return the number of songs in the queue."""
        with self.lock:
            return len(self.pq)

    def add_song(self, song_data, song_identifier=None):
        """
        Add a song data object with zero votes.

        A separate identifier can optionally be provided for use during lookup for voting.
        The first item of the tuple returned is:
            True if the song did not exist yet (by identifier) and was added.
            False if the song identifier already existed and the add was treated as an upvote.
        The second item of the tuple returned is (votes, song_data, song_identifier).
        """
        song_identifier = song_data if song_identifier is None else song_identifier
        with self.lock:
            if song_identifier in self.entries_by_song:
                entry = self.entries_by_song[song_identifier]
                entry[0] -= 1 # Upvote if identifier already exists
                heapq.heapify(self.pq)
                priority, count, song_data, song_identifier = entry
                return False, (-priority, song_data, song_identifier)
            else:
                count = next(self.counter)
                entry = [0, count, song_data, song_identifier]
                self.entries_by_song[song_identifier] = entry
                heapq.heappush(self.pq, entry)
                priority, count, song_data, song_identifier = entry
                return True, (-priority, song_data, song_identifier)

    def upvote_song(self, song_identifier):
        """
        Increment the number of votes that a song has. Internally, this means decreasing its priority.

        Return (votes, song_data, song_identifier) for the song that was upvoted.
        """
        with self.lock:
            entry = self.entries_by_song[song_identifier]
            entry[0] -= 1
            self.update_data_funct(entry[2], -entry[0]) # song_data, votes
            heapq.heapify(self.pq)
            priority, count, song_data, song_identifier = entry
            return (-priority, song_data, song_identifier)

    def downvote_song(self, song_identifier):
        """
        Increment the number of votes that a song has. Internally, this means increasing its priority.

        Return (votes, song_data, song_identifier) for the song that was downvoted.
        """
        with self.lock:
            entry = self.entries_by_song[song_identifier]
            entry[0] += 1
            self.update_data_funct(entry[2], -entry[0]) # song_data, votes
            heapq.heapify(self.pq)
            priority, count, song_data, song_identifier = entry
            return (-priority, song_data, song_identifier)

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

    def get_all(self):
        """Return a list of tuples (votes, song_data, song_identifier) for all songs in the queue."""
        with self.lock:
            ret = []
            for priority, count, song_data, song_identifier in self.pq:
                ret.append((-priority, song_data, song_identifier))
            return ret


class Song:
    """A wrapper class to hold all associated metadata for a song."""

    def __init__(self, uri, requestee, time):
        """Create a new Song."""
        self.uri = uri
        self.requestee = requestee
        self.time = time
        self.upvotes = 0
