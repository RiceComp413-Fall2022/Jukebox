"""Routines related to song queue manangement."""

import time
import heapq
import threading
import itertools

class SongQueue:
    """A song queue which can keep track of song rankings according to upvotes/downvotes."""

    def __init__(self, primary_user_id):
        """Create an empty song queue containing no songs. self.counter is monotonic to maintain insertion ordering."""
        self.pq = []
        self.lock = threading.Lock()
        self.counter = itertools.count()
        self.entries_by_song = {}
        self.primary_user_id = primary_user_id

    def __len__(self):
        """Return the number of songs in the queue."""
        with self.lock:
            return len(self.pq)

    def add_song(self, user_id, uri):
        """
        Add a song data object with zero votes.

        A separate identifier can optionally be provided for use during lookup for voting.
        The Boolean returned is:
            True if the song did not exist yet (by identifier) and was added.
            False if the song identifier already existed and the add was treated as an upvote.
        """
        with self.lock:
            if uri in self.entries_by_song:
                entry = self.entries_by_song[uri]
                entry[0] -= 1 # Upvote if identifier already exists
                entry[2].upvotes = -entry[0]
                heapq.heapify(self.pq)
                return False
            else:
                song_data = Song(user_id, uri)
                count = next(self.counter)
                entry = [0, count, song_data]
                self.entries_by_song[uri] = entry
                heapq.heappush(self.pq, entry)
                return True

    def upvote_song(self, user_id, uri):
        """
        Increment the number of votes that a song has. Internally, this means decreasing its priority.

        Return a success boolean.
        """
        with self.lock:
            if uri not in self.entries_by_song:
                return False
            entry = self.entries_by_song[uri]
            already_voted = user_id in entry[2].upvotes_by_user
            if not already_voted or entry[2].upvotes_by_user[user_id] != 1:
                entry[0] -= 1
                entry[2].upvotes = -entry[0]
                if not already_voted:
                    entry[2].upvotes_by_user[user_id] = 0
                entry[2].upvotes_by_user[user_id] += 1
                heapq.heapify(self.pq)
                return True
            else:
                return False

    def downvote_song(self, user_id, uri):
        """
        Decrement the number of votes that a song has. Internally, this means increasing its priority.

        Return a success boolean.
        """
        with self.lock:
            if uri not in self.entries_by_song:
                return False
            entry = self.entries_by_song[uri]
            already_voted = (user_id in entry[2].upvotes_by_user)
            if not already_voted or entry[2].upvotes_by_user[user_id] != -1:
                entry[0] += 1
                entry[2].upvotes = -entry[0]
                if not already_voted:
                    entry[2].upvotes_by_user[user_id] = 0
                entry[2].upvotes_by_user[user_id] -= 1
                heapq.heapify(self.pq)
                return True
            else:
                return False

    def remove_song(self, user_id, uri):
        """Remove a song from the queue by its identifier."""
        with self.lock:
            if uri not in self.entries_by_song:
                return False
            entry = self.entries_by_song[uri]
            is_owner = (user_id == entry[2].user_id)
            if is_owner or user_id == self.primary_user_id:
                self.pq.remove(entry)
                del self.entries_by_song[uri]
                return True
            else:
                return False

    def get_all(self):
        """Return a list of tuples (votes, song_data, song_identifier) for all songs in the queue."""
        with self.lock:
            ret = []
            for priority, count, song_data in self.pq:
                ret.append(song_data)
            return ret

class Song:
    """A wrapper class to hold all associated metadata for a song."""

    def __init__(self, user_id, uri):
        """Create a new Song."""

        self.user_id = user_id
        self.uri = uri

        self.upvotes = 0
        self.upvotes_by_user = {}

        # Set automatically
        self.time = time.time()
