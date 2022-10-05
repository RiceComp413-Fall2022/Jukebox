import React from "react";
import styled from "styled-components";

export default function Login() {
  const handleClick = async () => {
    
    const client_id = "0b2885f02bea4a8f887f715664b411e9";
    const redirect_uri = "http://localhost:3000/"
    const api_uri = "https://accounts.spotify.com/authorize";
    const scopes = [
      'streaming',
      'user-read-birthdate',
      'user-read-private',
      'user-modify-playback-state'
    ];
    const scope = [
      "streaming",
      "user-read-email",  // I have found this is necessary for playback, YMMV
      "user-read-private",
      "user-read-playback-state",
      "user-modify-playback-state",
      "playlist-read-collaborative",
      "playlist-modify-public",
      "playlist-modify-private",
      "playlist-read-private",
      "playlist-read-collaborative",

    ];
    window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join('%20')}&response_type=token&show_dialog=true`;

  };
  return (
    <Container>
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Black.png"
        alt="spotify"
      />
      <button onClick={handleClick}>Connect Spotify</button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #1db954;
  gap: 5rem;
  img {
    height: 20vh;
  }
  button {
    padding: 1rem 5rem;
    border-radius: 5rem;
    background-color: black;
    color: #49f585;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
  }
`;