"""Tests for the songqueue functionality."""

import unittest

from src.server.songqueue import SongQueue

class test_songqueue(unittest.TestCase):
    """Tests for the songqueue functionality."""

    def __init__(self, *args, **kwargs):
        """Create a new SongQueue when the test class is instantiated."""
        super(test_songqueue, self).__init__(*args, **kwargs)
        self.sq = SongQueue("primary_user")

    def a_test_songqueue_is_empty(self):
        """Ensure that the song queue is empty after creation."""
        self.assertTrue(len(self.sq) == 0)

    def b_test_add_song(self):
        """Ensure that the proper song appears when added."""
        self.sq.add_song("mysong1")
        self.assertTrue(len(self.sq) == 1)
        self.assertTrue(self.sq.get_top(1)[0][1] == "mysong1")
        self.assertTrue(self.sq.get_all()[0][1] == "mysong1")
