import config
from flask import Flask
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from routes import routes

app = Flask(__name__)
app.register_blueprint(routes)

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
