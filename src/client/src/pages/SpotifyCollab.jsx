import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import FooterCollab from "../components/FooterCollab";
import Navbar from "../components/Navbar"; 
import { reducerCases } from "../utils/Constants";

import { useStateProvider } from "../utils/StateProvider";
import RenderTrackCollab from "../components/RenderTrackCollab";

import axios from "axios";
const qs = require('qs');

export default function SpotifyCollab(props) {
  const [{ setGroup, setUUID}, dispatch] = useStateProvider();
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

  useEffect(() => {
    const sse = new EventSource(`http://127.0.0.1:5000/songQueueListen?roomid=${setGroup}&userid=${setUUID}`,
      { withCredentials: false });

    sse.addEventListener('song_queue', (e) => {dispatch({type: reducerCases.SET_MULT_SONGS, setMultSongs: e.data}); console.log('collab')});

    sse.addEventListener('current_song', (e) => {
      if (e.data.length > 5) {
        dispatch({
          type: reducerCases.SET_TRACK_C,
          setTrackC: JSON.stringify(e.data).substring(28, 50)
        });
      }
    });
 
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

    
  }, [setGroup, setUUID]);
  
  return (
  <Container>
    <div className="spotify__body">
      <div className="body" ref={bodyRef} onScroll={bodyScrolled}>
        <Navbar token = {tok} navBackground={navBackground} />
        
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
