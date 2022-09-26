import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
export default function CurrentTrack() {
    
  const tempSong = {
    uri: "spotify:track:12Zex1yqVOGxKSXa0rFi3c", // Spotify URI
    id: null,                // Spotify ID from URI (can be null)
    type: "track",             // Content type: can be "track", "episode" or "ad"
    media_type: "audio",       // Type of file: can be "audio" or "video"
    name: "what was the last thing u said",         // Name of content
    is_playable: true,         // Flag indicating whether it can be played
    album: {
      uri: 'spotify:album:2MrgIgzeQvPFRCmG12C7Xo', // Spotify Album URI
      name: 'Album Name',
    //   images: [
    //     { url: "https://image/xxxx" }
    //   ]
    },
    artists: [
      { uri: 'spotify:artist:1J6OD7vLbjEuFVgVRlusmS', name: "Artist Name" }
    ]
  };  
  const [{ token, currentPlaying }, dispatch] = useStateProvider();
  useEffect(() => {
    const getCurrentTrack = async () => {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.data !== "") {
        // const currentPlaying = {
        //   id: response.data.item.id,
        //   name: response.data.item.name,
        //   artists: response.data.item.artists.map((artist) => artist.name),
        //   image: response.data.item.album.images[2].url,
        // };
        const currentPlaying = tempSong;
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: tempSong });
      } else {
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: tempSong });
      }
    };
    getCurrentTrack();
  }, [token, dispatch]);
  return (
    <Container>
      {currentPlaying && (
        <div className="track">
          <div className="track__image">
            <img src={currentPlaying.image} alt="currentPlaying" />
          </div>
          <div className="track__info">
            <h4 className="track__info__track__name">{currentPlaying.name}</h4>
            <h6 className="track__info__track__artists">
              {currentPlaying.artists.join(", ")}
            </h6>
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    &__image {
    }
    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      &__track__name {
        color: white;
      }
      &__track__artists {
        color: #b3b3b3;
      }
    }
  }
`;