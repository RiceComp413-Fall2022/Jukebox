"""
Tests that a song queue can be sent end to end.

Doesn't currently work.
"""
from contextlib import contextmanager
from functools import partial
from unittest import mock
import pytest

from src.server.main import app
from src.server.listen import stream

@contextmanager
def mock_events():
    with mock.patch('src.server.listen.stream', partial(stream, testing=True)):
        yield

@pytest.fixture
def client():
    app.testing = True

    with app.test_client() as client:
        yield client

def test_song_queue_listen(client):
    """
    Subscribe as a song queue listener and see that the server can send song events to us and we can receive it.
    """
    # start server   
    with mock_events(): 
        r = client.get('/songQueueListen')

    print(r.data)
    assert False
