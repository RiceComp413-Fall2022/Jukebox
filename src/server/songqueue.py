import heapq
import threading
import itertools

class SongQueue:

    def __init__(self):
        self.pq = []
        self.lock = threading.Lock()
        self.counter = itertools.count()
        self.entries_by_song = {}

    def __len__(self):
        with self.lock:
            return len(self.pq)

    def add_song(self, song_data, song_identifier=None):
        song_identifier = song_data if song_identifier is None else song_identifier
        with self.lock:
            count = next(self.counter)
            entry = [0, count, song_data, song_identifier]
            self.entries_by_song[song_identifier] = entry
            heapq.heappush(self.pq, entry)

    def update_song(self, song_identifier, new_votes):
        with self.lock:
            entry = self.entries_by_song[song_identifier]
            entry[0] = -new_votes
            heapq.heapify(self.pq)

    def upvote_song(self, song_identifier):
        with self.lock:
            entry = self.entries_by_song[song_identifier]
            entry[0] -= 1
            heapq.heapify(self.pq)

    def downvote_song(self, song_identifier):
        with self.lock:
            entry = self.entries_by_song[song_identifier]
            entry[0] += 1
            heapq.heapify(self.pq)

    def remove_top(self):
        with self.lock:
            while self.pq:
                priority, count, song_data, song_identifier = heapq.heappop(self.pq)
                del self.entries_by_song[song_identifier]
                return song
            return None

    def get_top(self, n):
        with self.lock:
            # votes, song_data, song_identifier
            return [(-item[0], item[2], item[3]) for item in heapq.nsmallest(n, self.pq)]
