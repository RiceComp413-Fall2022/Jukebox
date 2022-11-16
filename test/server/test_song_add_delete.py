"""Unit tests for the /songQueueCreate API endpoint."""
import pytest # noqa: F401
import logging

from .fixtures import client # noqa: F401
from src.server.resources import queues

LOGGER = logging.getLogger(__name__)

# place holder userid and roomid
userid = 'test_add_delete_1'
userid_2 = 'test_add_delete_2'
roomid = 'test_add_delete_room'

uris = ["spotify:track:5YZuePCawcrg0DJrWovPu7",
        "spotify:track:3Ofmpyhv5UAQ70mENzB277",
        "spotify:track:0qcr5FMsEO85NAQjrlDRKo",
        "spotify:track:1IHWl5LamUGEuP4ozKQSXZ"]


def test_initialize(client): # noqa: F811
    """Add all the songs to the queue before executing tests."""
    r = client.get(f'/songQueueCreate?userid={userid}&roomid={roomid}')

    if (r.status != "200 OK"):
        LOGGER.error(f"songQueueCreate get request failed with userid: {userid} and roomid: {roomid}:\n{r}")
        assert False

    assert True


def test_add_song(client): # noqa: F811
    """Test adding a song via the song api works correctly."""
    r = client.get(f'/addSong?userid={userid}&uri={uris[0]}&roomid={roomid}')

    assert r.status == "200 OK" and len(queues[roomid].get_all()) == 1

    client.get(f'/addSong?userid={userid}&uri={uris[1]}&roomid={roomid}')
    client.get(f'/addSong?userid={userid_2}&uri={uris[2]}&roomid={roomid}')
    client.get(f'/addSong?userid={userid_2}&uri={uris[3]}&roomid={roomid}')

    assert r.status == "200 OK" and len(queues[roomid].get_all()) == 4


def test_remove_song(client): # noqa: F811
    """Test removing a song via the remove song api."""
    r = client.get(f'/removeSong?userid={userid}&uri={uris[0]}&roomid={roomid}')

    assert r.status == "200 OK" and len(queues[roomid].get_all()) == 3

    client.get(f'/removeSong?userid={userid_2}&uri={uris[3]}&roomid={roomid}')
    assert r.status == "200 OK" and len(queues[roomid].get_all()) == 2

    # Primary user removing a song which they did not add
    r = client.get(f'/removeSong?userid={userid}&uri={uris[2]}&roomid={roomid}')
    assert r.status == "200 OK" and len(queues[roomid].get_all()) == 1


def test_invalid_remove_song(client): # noqa: F811
    """Test that removing a song which you did not add fails if you are not primary user."""
    r = client.get(f'/removeSong?userid={userid_2}&uri={uris[1]}&roomid={roomid}')
    assert r.status != "200 OK" and r.status == "400 BAD REQUEST" and len(queues[roomid].get_all()) == 1
