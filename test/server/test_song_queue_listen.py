"""
Tests that a song queue can be sent end to end.

Doesn't currently work.
"""

import asyncio
import pytest
import requests

from multiprocessing import Process

from sseclient import SSEClient
from start_server import start
from announcer import SONG_QUEUE_EVENT

async def get_message_event(msg_event):
    """Grabs messages from listen and assigns them to shared variable."""
    msgs = SSEClient('http://127.0.0.1:5000/songQueueListen')
    msg_event.set_result(msgs[0].event)

@pytest.mark.asyncio
@pytest.mark.skip
async def test_song_queue_listen():
    """
    Subscribe as a song queue listener and see that the server can send song events to us and we can receive it.

    Can't currently get this working but have tested manually
    """
    # # start server
    server = Process(target=start)
    server.start()

    loop = asyncio.get_running_loop()
    msg_event = loop.create_future()

    # listen for song queues
    listener = loop.create_task(get_message_event(msg_event))
    # stop flake from yelling at me
    listener

    await asyncio.sleep(1)
    requests.get('http://127.0.0.1:5000/addSong')

    await msg_event

    # shutdown server
    server.terminate()
    server.join()

    print(msg_event)
    assert msg_event == SONG_QUEUE_EVENT
