"""Unit tests for the /songQueueCreate API endpoint."""
import pytest # noqa: F401
import logging

from .fixtures import client # noqa: F401
from src.server.resources import queues

LOGGER = logging.getLogger(__name__)

# place holder userid and roomid
userid = 'test_sq_create'
roomid = 'test_sq_create_room'

def test_success(client): # noqa: F811
    """Test that a get request to the /songQueueCreate endpoint is sucessful."""
    r = client.get(f'/songQueueCreate?userid={userid}&roomid={roomid}')

    if (r.status != "200 OK"):
        LOGGER.error(f"songQueueCreate get request failed with userid: {userid} and roomid: {roomid}:\n{r}")
        assert False

    assert True

def test_create_entry(client): # noqa: F811
    """Test that a get request to the /songQueueCreate endpoint creates a key value pair in queues for the song queue."""
    client.get(f'/songQueueCreate?userid={userid}&roomid={roomid}')

    assert roomid in queues.keys()

def test_entry_userid(client): # noqa: F811
    """Test that a get request to the /songQueueCreate endpoint creates song queue entry with the correct userid."""
    client.get(f'/songQueueCreate?userid={userid}&roomid={roomid}')

    assert queues[roomid].primary_user_id == userid

def test_entry_empty_queue(client): # noqa: F811
    """Test that a get request to the /songQueueCreate endpoint creates song queue entry that is empty."""
    client.get(f'/songQueueCreate?userid={userid}&roomid={roomid}')

    assert len(queues[roomid].pq) == 0
