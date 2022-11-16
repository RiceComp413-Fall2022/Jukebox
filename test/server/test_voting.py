"""Unit tests for the /songQueueCreate API endpoint."""
import pytest # noqa: F401
import logging

from .fixtures import client # noqa: F401
from src.server.resources import queues

LOGGER = logging.getLogger(__name__)

# place holder userid and roomid
userid = 'test_voting_1'
userid_2 = 'test_voting_2'
roomid = 'test_voting_room'

uris = ["spotify:track:5YZuePCawcrg0DJrWovPu7",
        "spotify:track:3Ofmpyhv5UAQ70mENzB277",
        "spotify:track:0qcr5FMsEO85NAQjrlDRKo",
        "spotify:track:1IHWl5LamUGEuP4ozKQSXZ"]

def test_initialize(client): # noqa: F811
    """Add all the songs to the queue before executing tests."""
    client.get(f'/songQueueCreate?userid={userid}&roomid={roomid}')
    for uri in uris:
        client.get(f'/addSong?userid={userid}&uri={uri}&roomid={roomid}')

def test_upvote_explicit(client): # noqa: F811
    """Test that upvoting a song via upvote api works correctly."""
    client.get(f'/upvoteSong?userid={userid}&uri={uris[0]}&roomid={roomid}')

    queue_songs = queues[roomid].get_all()

    for song in queue_songs:
        if song.uri == uris[0]:
            assert song.upvotes == 1
        else:
            assert song.upvotes == 0

    client.get(f'/upvoteSong?userid={userid_2}&uri={uris[0]}&roomid={roomid}')

    queue_songs = queues[roomid].get_all()

    for song in queue_songs:
        if song.uri == uris[0]:
            assert song.upvotes == 2
        else:
            assert song.upvotes == 0

def test_upvote_implicit(client): # noqa: F811
    """Test that upvoting a song works via add song api call works correctly."""
    client.get(f'/addSong?userid={userid}&uri={uris[1]}&roomid={roomid}')

    queue_songs = queues[roomid].get_all()

    for song in queue_songs:
        if song.uri == uris[0]:  # Upvote from above test case.
            assert song.upvotes == 2
        elif song.uri == uris[1]:  # Implicit upvote.
            assert song.upvotes == 1
        else:
            assert song.upvotes == 0
    client.get(f'/addSong?userid={userid_2}&uri={uris[1]}&roomid={roomid}')

    queue_songs = queues[roomid].get_all()

    for song in queue_songs:
        if song.uri == uris[0]:  # Upvote from above test case.
            assert song.upvotes == 2
        elif song.uri == uris[1]:  # Implicit upvote.
            assert song.upvotes == 2
        else:
            assert song.upvotes == 0

def test_upvote_reject(client): # noqa: F811
    """Test that upvotes are rejected a user has already upvoted a song."""
    # Test implicit after explicit
    r = client.get(f'/addSong?userid={userid}&uri={uris[0]}&roomid={roomid}')
    assert r.status != "200 OK" and r.status == "400 BAD REQUEST"

    # Test explicit after implicit
    r = client.get(f'/upvoteSong?userid={userid_2}&uri={uris[1]}&roomid={roomid}')
    assert r.status != "200 OK" and r.status == "400 BAD REQUEST"

    # Test implicit after implicit
    r = client.get(f'/addSong?userid={userid_2}&uri={uris[1]}&roomid={roomid}')
    assert r.status != "200 OK" and r.status == "400 BAD REQUEST"

    # Test explicit after explicit
    r = client.get(f'/upvoteSong?userid={userid}&uri={uris[0]}&roomid={roomid}')
    assert r.status != "200 OK" and r.status == "400 BAD REQUEST"

def test_downvote_explicit(client): # noqa: F811
    """Test that downvoting a song works via downvote api call."""

    """Test that upvoting a song via upvote api works correctly."""
    client.get(f'/downvoteSong?userid={userid}&uri={uris[2]}&roomid={roomid}')

    queue_songs = queues[roomid].get_all()

    for song in queue_songs:
        if song.uri == uris[0]:  # Upvote from above test case.
            assert song.upvotes == 2
        elif song.uri == uris[1]:  # Implicit upvote.
            assert song.upvotes == 2
        elif song.uri == uris[2]:
            assert song.upvotes == -1
        else:
            assert song.upvotes == 0

    client.get(f'/downvoteSong?userid={userid_2}&uri={uris[2]}&roomid={roomid}')

    queue_songs = queues[roomid].get_all()

    for song in queue_songs:
        if song.uri == uris[0]:  # Upvote from above test case.
            assert song.upvotes == 2
        elif song.uri == uris[1]:  # Implicit upvote.
            assert song.upvotes == 2
        elif song.uri == uris[2]:
            assert song.upvotes == -2
        else:
            assert song.upvotes == 0
