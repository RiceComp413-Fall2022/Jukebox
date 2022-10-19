"""Used to define shared resources for the server."""
from .messageAnnouncer import SSEMessageAnnouncer
from .songqueue import SongQueue


def update_votes(data, new_votes):
    """Update votes."""
    data.upvotes = new_votes


announcer = SSEMessageAnnouncer()

queue = SongQueue(update_data_funct=update_votes)


class RequestHandlingException(Exception):
    """
    Custom exception type to be thrown by any method which runs into an issue handling the request from the front end.

    This exception should be caught to prevent server errors. When caught, relay the error to the front end.
    """

    def __init__(self, message):
        """Set the message."""
        self.message = message
