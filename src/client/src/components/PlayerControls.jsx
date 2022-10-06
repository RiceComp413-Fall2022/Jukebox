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
  const [{ token, playerState }, dispatch] = useStateProvider();
  const [is_active, setActive] = useState(false);
  const [id, setId]= useState(undefined);
  const [userId, setUserId] = useState(undefined);
  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [{ userInfo }] = useStateProvider();
  const single_uri ='{"uris": ["spotify:track:2HScVhNGt7DltJYrph09Ee"]}';
  const mult_uri = '{"uris": ["spotify:track:2LO5hQnz5rEaRwkGUvZcHN", "spotify:track:6IpvkngH89cA3hhPC84Leg", "spotify:track:63dLm0BUpepXeFIfZ0OKEL"]}';
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

          // setTrack(state.track_window.current_track);
          setPaused(state.paused);

          player.getCurrentState().then( state => { 
              (!state)? setActive(false) : setActive(true) 
          });

          player.getCurrentState().then( state)

      }));

      player.connect();
    };
  }, []);
  const getId = async () => { 
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/devices",
        type: "PUT",
        data: '{"uris": ["spotify:track:2HScVhNGt7DltJYrph09Ee"]}',
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + props.token);},
        success: function(data) { 
          console.log(data)
        }
    });
    
    // await axios.put(
    //   `https://api.spotify.com/v1/me/player/${state}`,
    //   {},
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + token,
    //     },
    //   }
    // );
    dispatch({
      type: reducerCases.SET_PLAYER_STATE,
      playerState: !playerState,
    });
  };

  function parseURIList(uris){
    let canAdd = false
    let temp = ''
    for(const cVal of mult_uri){
      if(cVal == "["){
        canAdd = true
      }
      else if(cVal == "]"){
        canAdd = false
      }
      else if(canAdd){
        temp += cVal;
      }
    }
    return JSON.parse("[" + temp + "]");
  }
  function changeState(uris) {
    const state = playerState ? "pause" : "play";
    if(!is_active){
      $.ajax({
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + id,
        type: "PUT",
        data: uris,
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + props.token);},
        success: function(data) { 
          // console.log(data)
        }
    });
  }
  

 

  // const changeState = async(device_id) => { 
  //   const state = playerState ? "pause" : "play";
  //   $.ajax({
  //       url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
  //       type: "PUT",
  //       data: '{"uris": ["spotify:track:2HScVhNGt7DltJYrph09Ee"]}',
  //       beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + props.token);},
  //       success: function(data) { 
  //         console.log(data)
  //       }
  //   });
    
    // await axios.put(
    //   `https://api.spotify.com/v1/me/player/${state}`,
    //   {},
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + token,
    //     },
    //   }
    // );
    dispatch({
      type: reducerCases.SET_PLAYER_STATE,
      playerState: !playerState,
    });
  };

  // function createPlaylist(){
  //   console.log(userInfo.userId)
  //   $.ajax({
  //     url: "https://api.spotify.com/v1/users/" + userInfo.userId + "/playlists",
  //     type: "POST",
  //     beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + props.token);},
  //     success: function(data) { 
  //       console.log(data);
  //     }
  //   });
    
  // }

  // function addURItoPlaylist(uris){
    
  // }
  const changeTrack = async(type) => {
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/${type}`,
      type: "POST",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + props.token);},
      success: function(data) { 
      }
    });
    // await axios.post(
    //   `https://api.spotify.com/v1/me/player/${type}`,
    //   {},
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + token,
    //     },
    //   }
    // );
    dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
    const response1 = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token,
        },
      }
    );

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
          <BsFillPauseCircleFill onClick={() => {setPaused(true); player.togglePlay(); changeState(props.uriVal); }}/>
        ) : (
          <BsFillPlayCircleFill onClick={() => { setPaused(false); player.togglePlay(); changeState(props.uriVal); }}/>
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