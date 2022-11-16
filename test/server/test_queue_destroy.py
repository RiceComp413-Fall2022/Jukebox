"""Unit tests for the /songQueueCreate API endpoint."""
import pytest # noqa: F401
import logging

from .fixtures import client # noqa: F401
from src.server.resources import queues

LOGGER = logging.getLogger(__name__)

# place holder userid and roomid
userid = 'test_sq_destroy'
userid_2 = 'test_sq_destroy_2'
roomid = 'test_sq_destroy_room'


def test_initialize(client): # noqa: F811
    """Initialize a song queue to be deleted."""
    r = client.get(f'/songQueueCreate?userid={userid}&roomid={roomid}')

    if (r.status != "200 OK"):
        LOGGER.error(f"songQueueCreate get request failed with userid: {userid} and roomid: {roomid}:\n{r}")
        assert False

    assert True


def test_delete_invalid(client): # noqa: F811
    """Test that the song queue delete endpoint rejects request not from primary user."""
    r = client.get(f'/songQueueDestroy?userid={userid_2}&roomid={roomid}')

    assert r.status != "200 OK" and r.status == '400 BAD REQUEST' and roomid in queues

def test_delete(client): # noqa: F811
    """Test that the song queue delete endpoint accepts valid delete requests."""
    r = client.get(f'/songQueueDestroy?userid={userid}&roomid={roomid}')

    assert r.status == "200 OK" and roomid not in queues
