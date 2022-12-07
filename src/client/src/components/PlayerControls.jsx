import React, { useState, useEffect, useRef } from "react";
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
import reducer from "../utils/Reducer";
import { IronTwoTone, SettingsRemoteSharp, UndoRounded } from "@mui/icons-material";



export default function PlayerControls(props) {
  const [{ playerState, setChangeCurr, setMultSongs, setGroup, setUpdate, setUUID }, dispatch] = useStateProvider();
  const [is_active, setActive] = useState(false);
  var tItr = useRef(0);
  var tVal = useRef({});
  // var tItr = 0;
  const [cVal, setCVal] = useState({})
  const [id, setId] = useState(0);
  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);

  // === undefined ? '' : JSON.parse(setMultSongs)[0].uri.substring(14)
  // console.log(setMultSongs)
  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  useEffect(() => {
    const sse = new EventSource('http://127.0.0.1:5000/songQueueListen?roomid=' + setGroup,
      { withCredentials: false });

    sse.addEventListener('song_queue', (e) => { tVal.current = e.data; dispatch({ type: reducerCases.SET_UPDATE, setUpdate: e.data }); dispatch({ type: reducerCases.SET_MULT_SONGS, setMultSongs: e.data }); setCVal(cVal => e.data); });

    // sse.onopen = (e) => {
    //   console.log('open')
    // }

    sse.onerror = () => {
      // error log here 
      console.error('Bricked; Could not listen to room ' + setGroup);

      sse.close();
    }

    return () => {
      sse.close();
    };
  }, [dispatch, setGroup]);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {

      const player = new window.Spotify.Player({
        name: 'Jukebox.lol room ' + setGroup,
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
      player.addListener('player_state_changed', ({ track_window: { current_track } }
      ) => {
        dispatch({ type: reducerCases.SET_CHANGE_CURR, setChangeCurr: current_track })
      })

      player.connect();

    }

  }, [props.token]);

  useEffect(() => {
    if (player !== undefined) {
      player.addListener('player_state_changed', (state
      ) => {

        var alreadyPlayed = state.track_window.previous_tracks
        if (alreadyPlayed.length > 0) {
          player.pause()
        }
        if (state.paused && state.position === 0) {
          tItr.current++
          if (cVal !== undefined) {
            if (tItr.current === 4) {

              console.log(tItr.current)
              changeSong()
            }
            // tItr.current = 0;


          }
        }


        if (state.position === 0 && alreadyPlayed.length === 0 && !state.paused) {
          tItr.current = 0
        }
      });
    }

  }, [setUpdate])
  // tItr = 0




  //   player.addListener('player_state_changed', (
  //     { 
  //       state, 
  //     }) => {
  //     if (!state) {
  //         return;
  //     }

  //     setPaused(state.paused);

  //     player.getCurrentState().then( state => { 
  //         (!state)? setActive(false) : setActive(true) 
  //     });

  //     player.getCurrentState().then( state)

  // });
  // }

  // }, [])
  // there arte 3 callbacks we only want 1. try using pretrack currtrack states to check on identitical callbacks? and change this method to delete the
  // 0th song and play the first song
  var alr_play = new Set()
  async function changeSong() {
    await sleep(500)
    // tItr ++;
    if (alr_play.has(JSON.stringify(tVal.current).substring(14, 50)) == false && id != 0) {
      console.log("should change")
      await $.ajax({
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + id,
        type: "PUT",
        data: "{" + "\"uris\": [\"" + JSON.stringify(tVal.current).substring(14, 50) + "\"]}",
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + props.token); },
        success: function (data) { }
      });
      alr_play.add(JSON.stringify(tVal.current).substring(14, 50))
      axios.get('/removeSong?userid=' + setUUID + '&roomid=' + setGroup + '&uri=' + JSON.stringify(tVal.current).substring(14, 50));
    }
  }
  async function getUri(uris, useParse) {
    let pVal = ''

    // if(useParse === 0){
    //   pVal = JSON.parse(uris)[0].uri
    //   // axios.get('/removeSong?userid=' + setUUID + '&roomid=' + setGroup + '&uri=' + pVal);
    // } 
    // else {
    // console.log(setMultSongs)
    if (useParse === 0) {
      pVal = JSON.parse(uris)[0].uri
    }
    else if (props.uriVal !== undefined) {
      console.log("After", setMultSongs)

      pVal = JSON.stringify(props.uriVal).substring(14, 50)
    }
    // }
    let temp2 = "{" + "\"uris\": [\"" + pVal + "\"]}"
    // // console.log(temp2)
    if (!is_active && alr_play.has(JSON.stringify(setMultSongs).substring(14, 50)) === false) {
      $.ajax({
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + id,
        type: "PUT",
        data: "{" + "\"uris\": [\"" + JSON.stringify(setMultSongs).substring(14, 50) + "\"]}",
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + props.token); },
        success: function (data) {
          alr_play.add(JSON.stringify(setMultSongs).substring(14, 50))
        }
      });

      // console.log("BEFORE", setMultSongs)
      // await axios.get('/removeSong?userid=' + setUUID + '&roomid=' + setGroup + '&uri=' + JSON.stringify(setMultSongs).substring(14, 50));
      // console.log("Removed Prev Song")
      await sleep(2000)
      // dispatch({type: reducerCases.SET_UPDATE, setUpdate: uris})

      // }
    }
  }

  function changeState() {
    console.log(props.uriVal)
    playerState ?
      axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${id}`, {}, {
        headers: { "Authorization": 'Bearer ' + props.token },
        // data: props.uriVal,
      }).catch(function (error) {
        if (error.response.status === 402) {
          console.log(error.response.reason)
          alert("Need Spotify Premium to Use Player")
        }
      }) :
      axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {}, {
        headers: { "Authorization": 'Bearer ' + props.token },
        // data: props.uriVal,
      }).catch(function (error) {
        if (error.response.status === 402) {
          alert("Need Spotify Premium to Use Player")
        }
      });

    dispatch({
      type: reducerCases.SET_PLAYER_STATE,
      playerState: !playerState,
    });
  };

  const changeTrack = async (type) => {
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/${type}`,
      type: "POST",
      beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + props.token); },
      success: function (data) {
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
      <div className="state">
        {!is_paused ? (
          <BsFillPauseCircleFill onClick={() => { setPaused(true); player.togglePlay(); }} />
        ) : (
          <BsFillPlayCircleFill onClick={() => { setPaused(false); player.togglePlay(); }} />
        )}
      </div>
      <div className="next">
        <CgPlayTrackNext onClick={() => { changeSong(); setPaused(false); }} />
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
