export const authEndpoint = "https://accounts.spotify.com/authorize";

const redirectUri = "http://localhost:3001/";

const clientID =  "0b2885f02bea4a8f887f715664b411e9";

const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state"
]

export const loginUrl = `${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialogue=true`