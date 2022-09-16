from flask import Flask

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

import config

app = Flask(__name__)

@app.route("/")
def hello_world():
    validate_uri("spotify:track:5YZuePCawcrg0DJrWovPu7")
    return "<p>Hello, World!</p>"

def validate_uri(uri):
    sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=config.SPOTIFY_CLIENT_ID,
                                                               client_secret=config.SPOTIFY_CLIENT_SECRET))
    try:
        track = sp.track(uri)
        print(track)
    except:
        print("Error fetching test track")
    else:
        print("Successfully retrieved test track")
