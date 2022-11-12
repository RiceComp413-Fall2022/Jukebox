import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import FooterCollab from "../components/FooterCollab";
import NavbarCollab from "../components/NavbarCollab"; 
import $, { event } from 'jquery'; 
import { reducerCases } from "../utils/Constants";

import { useStateProvider } from "../utils/StateProvider";
import RenderTrackCollab from "../components/RenderTrackCollab";


import axios from "axios";
const qs = require('qs');

export default function SpotifyCollab(props) {
  const [{ token, setImage, setGroup, setMultSongs}, dispatch] = useStateProvider();
  const [uriList, setUriList] = useStateProvider(undefined);
  const [navBackground, setNavBackground] = useState(false);
  const [tok, setTok] = useState(false);

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

  const SPOTIFY_CLIENT_ID = "0b2885f02bea4a8f887f715664b411e9"
  const SPOTIFY_CLIENT_SECRET = "8482283b3d87491aaa1416b1dc4c06a3"

  useEffect(() => {
    const getAuth = async() => {
        const data = { grant_type: "client_credentials" };
        const options = {
        method: "POST",
        headers: {
            Authorization:
            "Basic " +
            btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
            "content-type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify(data),
        url: "https://accounts.spotify.com/api/token",
        };
        const response = await axios(options);
    
        const { access_token } = response.data;
        setTok(access_token)   
    }
    getAuth()
  },[dispatch, token]);
  
  useEffect(() => {
    const sse = new EventSource('http://127.0.0.1:5000/songQueueListen?roomid=' + setGroup,
      { withCredentials: false });

    sse.addEventListener('song_queue', (e) => {dispatch({type: reducerCases.SET_MULT_SONGS, setMultSongs: e.data}); console.log('Mult Songs: ' + setMultSongs)});
 
    sse.onopen = (e) => {
      console.log('open')
    }

    sse.onerror = () => {
      // error log here 
      console.log('bricked')
      
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
        <NavbarCollab token = {tok} navBackground={navBackground} />
        
        <div className="body__contents">
          <RenderTrackCollab headerBackground={headerBackground} token={tok}/>
        </div>
      </div>
    </div>
    <div className="spotify__footer">
      <FooterCollab token = {tok}/>
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
