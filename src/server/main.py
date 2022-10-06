"""Sets up flask app."""
import spotipy
from flask import Flask
from spotipy.oauth2 import SpotifyClientCredentials

from src.server import config
from .routes import routes

app = Flask(__name__)
app.register_blueprint(routes)

def validate_uri(uri):
    """Validate uri."""
    sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=config.SPOTIFY_CLIENT_ID,
                                                               client_secret=config.SPOTIFY_CLIENT_SECRET))
    try:
        track = sp.track(uri)
        print(track)
    except Exception:
        print("Error fetching test track")
    else:
        print("Successfully retrieved test track")
