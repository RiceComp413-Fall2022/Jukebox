import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";
import $ from 'jquery'; 



export default function PlayerControls(props) {
  const [{ playerState }, dispatch] = useStateProvider();
  const [is_active, setActive] = useState(false);
  const [id, setId]= useState(undefined);
  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);


  
  useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {

        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(props.token); },
            volume: 0.5
        });

        setPlayer(player);

        player.addListener('ready', ({ device_id }) => {
            setId(device_id);
            console.log('Ready with Device ID', device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);

        });

        player.addListener('player_state_changed', ( state => {

          if (!state) {
              return;
          }

          setPaused(state.paused);

          player.getCurrentState().then( state => { 
              (!state)? setActive(false) : setActive(true) 
          });

          player.getCurrentState().then( state)

      }));

      player.connect();
    };
  }, []);

  function changeState() {
    playerState ? 
      axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${id}`, {}, {
        headers: { "Authorization": 'Bearer ' + props.token}
      }).catch(function (error){
        if(error.response.status === 402){
          console.log(error.response.reason)
          alert("Need Spotify Premium to Use Player")        
        }
      }) : 
      axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {}, {
        headers: { "Authorization": 'Bearer ' + props.token}
      }).catch(function (error){
        if(error.response.status === 402){
          alert("Need Spotify Premium to Use Player")
        }
      });

    dispatch({
      type: reducerCases.SET_PLAYER_STATE,
      playerState: !playerState,
    });
  };

  const changeTrack = async(type) => {
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/${type}`,
      type: "POST",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + props.token);},
      success: function(data) { 
      }
    });

    dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
    const response1 = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token,
        },
      }
    )
    

    if (response1.data !== "") {
      const currentPlaying = {
        id: response1.data.item.id,
        name: response1.data.item.name,
        artists: response1.data.item.artists.map((artist) => artist.name),
        image: response1.data.item.album.images[2].url,
      };
      dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
    } else {
      dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
    }
  };

  return (
    <Container>
      <div className="shuffle">
        <BsShuffle />
      </div>
      <div className="previous">
        <CgPlayTrackPrev onClick={() => changeTrack("previous")} />
      </div>
      <div className="state">
        {!is_paused ? (
          <BsFillPauseCircleFill onClick={() => {setPaused(true); player.togglePlay(); changeState(); }}/>
        ) : (
          <BsFillPlayCircleFill onClick={() => { setPaused(false); player.togglePlay(); changeState(); }}/>
        )}
      </div>
      <div className="next">
        <CgPlayTrackNext onClick={() => changeTrack("next")} />
      </div>
      {/* <button onClick={createPlaylist}>LOL</button> */}
      <div className="repeat">
        <FiRepeat />
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  svg {
    color: #b3b3b3;
    transition: 0.2s ease-in-out;
    &:hover {
      color: white;
    }
  }
  .state {
    svg {
      color: white;
    }
  }
  .previous,
  .next,
  .state {
    font-size: 2rem;
  }
`;