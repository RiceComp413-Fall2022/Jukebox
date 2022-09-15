from flask import Flask

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

app = Flask(__name__)

@app.route("/")
def hello_world():
    validate_uri("spotify:track:5YZuePCawcrg0DJrWovPu7")
    return "<p>Hello, World!</p>"

def validate_uri(uri):
    sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="c2164c838aba42d2a8c8bee966727e6a",
                                                               client_secret="465230974b6444afba0dd4c565c8a859"))
    try:
        track = sp.track(uri)
        print(track)
    except:
        print("Error fetching test track")
    else:
        print("Successfully retrieved test track")
