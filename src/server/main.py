import config
from flask import Flask
from flask import Response
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from messageAnnouncer import SSEMessageAnnouncer

app = Flask(__name__)

announcer = SSEMessageAnnouncer()

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

@app.route("/testListen", methods=['GET'])
def test_listen():
    def stream():
        messages = announcer.listen()  # returns a queue.Queue
        while True:
            msg = messages.get()  # blocks until a new message arrives
            yield msg

    return Response(stream(), mimetype='text/event-stream')

@app.route("/testAnnounce")
def test_announce():
    announcer.announce('Ping', event='Test')
    return {}, 200
