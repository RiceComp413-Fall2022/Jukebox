"""Handles URI validation."""
from urllib.error import HTTPError
import re
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from . import config

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=config.SPOTIFY_CLIENT_ID,
                                                           client_secret=config.SPOTIFY_CLIENT_SECRET))


def validate_uri(uri):
    """
    Validates a given URI.

    The validate uri function returns true or false based on whether or not the provided uri string is a correctly
    formatted Spotify URI, for an existing song. To return true, the uri must be formatted correctly AND the song must
    be valid.

    :param uri: string representing the Spotify uri for the request
    :return: true or false based on whether or not the uri is both correctly formatted AND valid
    """

    print("Testing uri " + uri)

    # All valid song URIs must contain this string at the start
    format_indx = uri.find("spotify:track:")
    if format_indx != 0:
        return False

    # Verify that remaining characters are valid and of correct length
    remaining = uri[14:]

    if len(remaining) != 22:
        return False

    # Assert that the string only contains valid characters
    if not bool(re.match("^[A-Za-z0-9]*$", remaining)):
        return False

    # URI is correctly formatted. At this point, the only way to weed out bad URIs is testing + catching exceptions
    try:
        sp.track(uri)
        return True
    except HTTPError as err:
        if err.code == 404:
            # Track does not exist. Return false.
            return False
        else:
            print("WARNING: Unknown error when querying uri " + uri)
            return False
    except spotipy.exceptions.SpotifyException:
        return False
