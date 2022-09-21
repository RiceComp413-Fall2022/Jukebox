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

    def add_song(self, song, initial_votes):
        with self.lock:
            count = next(self.counter)
            entry = [-initial_votes, count, song]
            self.entries_by_song[song] = entry
            heapq.heappush(self.pq, entry)

    def update_song(self, song, new_votes):
        with self.lock:
            entry = self.entries_by_song[song]
            entry[0] = -new_votes
            heapq.heapify(self.pq)

    def remove_top(self, song):
        with self.lock:
            while self.pq:
                priority, count, song = heapq.heappop(self.pq)
                del self.entries_by_song[song]
                return song
            return None

    def get_top(self, n):
        with self.lock:
            return [(-item[0], item(2)) for item in heapq.nsmallest(n, self.pq)]
