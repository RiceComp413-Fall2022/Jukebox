"""
Tests that the song queue listen api endpoint has the correct up to date song queue object passed to it.

Does not test that the new events received by a client from server sent events are correct. Only tests that the initial event is
information is correct.
"""
from contextlib import contextmanager
import json
from functools import partial
from unittest import mock
import pytest # noqa: F401

from src.server.announcer import SONG_QUEUE_EVENT
from src.server.listen import stream
from .fixtures import client # noqa: F401

# place holder userid and roomid
userid = 100
roomid = 101

@pytest.fixture(scope="function", autouse=True)
def setup(client): # noqa: F811
    """Before each test sets up our song queue."""
    client.get(f'/songQueueCreate?userid={userid}&roomid={roomid}')

@contextmanager
def set_stream_to_testing():
    """
    Mocks the server sent event steam so that it returns after sending initial song queue.

    This prevents the request from hanging and allows us to test the output.
    """
    with mock.patch('src.server.listen.stream', partial(stream, testing=True)):
        yield

def test_song_queue_listen_event(client): # noqa: F811
    """Checks that song queues that are sent to the client have correct event format."""

    with set_stream_to_testing():
        r = client.get(f'/songQueueListen?roomid={roomid}')

    assert f'event: {SONG_QUEUE_EVENT}' in r.data.decode('utf-8')

def test_song_queue_listen_empty_queue(client): # noqa: F811
    """Checks that the initial song queue with no songs added is formated corretly."""

    with set_stream_to_testing():
        r = client.get(f'/songQueueListen?roomid={roomid}')

    assert 'data: []' in r.data.decode('utf-8')

def test_song_queue_listen_one_song(client): # noqa: F811
    """Checks that the initial song queue with one song added is formated corretly."""

    # add song
    uri = 'spotify:track:5YZuePCawcrg0DJrWovPu7'
    client.get(f'/addSong?userid={userid}&uri={uri}&roomid={roomid}')

    # listen for queue
    with set_stream_to_testing():
        r = client.get(f'/songQueueListen?roomid={roomid}')

    string = r.data.decode('utf-8')
    j = json.loads(string[string.index('[') - 1:])

    assert uri == j[0]['uri']

def test_song_queue_listen_multiple_songs(client): # noqa: F811
    """Checks that the initial song queue with 4 song added is formated corretly."""

    # add song
    uris = ["spotify:track:5YZuePCawcrg0DJrWovPu7",
            "spotify:track:3Ofmpyhv5UAQ70mENzB277",
            "spotify:track:0qcr5FMsEO85NAQjrlDRKo",
            "spotify:track:1IHWl5LamUGEuP4ozKQSXZ"]
    for uri in uris:
        client.get(f'/addSong?userid={userid}&uri={uri}&roomid={roomid}')

    # listen for queue
    with set_stream_to_testing():
        r = client.get(f'/songQueueListen?roomid={roomid}')

    string = r.data.decode('utf-8')
    j = json.loads(string[string.index('[') - 1:])

    correct = True
    idx = 0
    for uri in uris:
        if j[idx]['uri'] != uri:
            print(f'Uri {uri}, should have been added but it listener did not get it or the order was incorrect. This is '
                  'what listener got: {j}')
            correct = False
            break
        idx += 1

    assert correct
