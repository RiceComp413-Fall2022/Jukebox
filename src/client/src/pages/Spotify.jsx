import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar"; 
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import RenderTrack from "../components/RenderTrack";

export default function Spotify() {
  const [{ token, setMultSongs, setGroup }, dispatch] = useStateProvider();
  const [navBackground, setNavBackground] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const bodyRef = useRef();
  const bodyScrolled = () => {
    bodyRef.current.scrollTop >= 30
      ? setNavBackground(true)
      : setNavBackground(false);
    bodyRef.current.scrollTop >= 268
      ? setHeaderBackground(true)
      : setHeaderBackground(false);
  };
 
  useEffect(() => {
    const getUserInfo = async () => {
      const { data } = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + token.access_token,
          "Content-Type": "application/json",
        },
      });
      const userInfo = {
        userId: data.id,
        userUrl: data.external_urls.spotify,
        name: data.display_name,
      };
      dispatch({ type: reducerCases.SET_USER, userInfo });
    };
    getUserInfo();
  }, [dispatch, token.access_token]);

  useEffect(() => {
    const getPlaybackState = async () => {
      const { data } = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: "Bearer " + token.access_token,
          "Content-Type": "application/json",
        },
      });
      dispatch({
        type: reducerCases.SET_PLAYER_STATE,
        playerState: data.is_playing,
      });
    };
    getPlaybackState();
  }, [dispatch, token.access_token]);

  useEffect(() => {
    const sse = new EventSource('http://127.0.0.1:5000/songQueueListen?roomid=' + setGroup,
      { withCredentials: false });
    
    sse.addEventListener('song_queue', (e) => {dispatch({type: reducerCases.SET_MULT_SONGS, setMultSongs: e.data}); console.log('Mult Songs: ' + setMultSongs)});

    sse.onopen = (e) => {
      console.log('open')
    }

    sse.onerror = () => {
      // error log here 
      console.error('Bricked; Could not listen to room ' + setGroup);
      
      sse.close();
    }

    return () => {
      sse.close();
    }; 
  }, [setGroup]);

  return (
    <Container>
    <div className="spotify__body">
      <div className="body" ref={bodyRef} onScroll={bodyScrolled}>
        <Navbar token = {token.access_token} navBackground={navBackground} />
        
        <div className="body__contents">
          <RenderTrack headerBackground={headerBackground} token={token.access_token}/>
        </div>
      </div>
    </div>
    <div className="spotify__footer">
      <Footer token = {token.access_token} uriVal={setMultSongs === undefined ? '' : setMultSongs[0]}/>
    </div>
  </Container>
  );
}

const Container = styled.div`
  max-height: 100vh;
  max-width: 100%;  
  overflow: hidden;
  display: grid;
  grid-template-rows: 85vh 15vh;
  .spotify__body {
    display: flex;
    grid-template-columns: 15vw 85vw;
    height: 100%;
    width: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 1));
    background-color: rgb(32, 87, 100);
    .body {
      height: 100%;
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.7rem;
        max-height: 2rem;
        &-thumb {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }
    .body__contents {
      display: flex;
      flex-direction: row;
      }
    }
  }
  `
  ;