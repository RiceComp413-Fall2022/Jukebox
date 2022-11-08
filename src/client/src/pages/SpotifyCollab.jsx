import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar"; 
import $ from 'jquery'; 
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import RenderTrack from "../components/RenderTrack";


import axios from "axios";
const qs = require('qs');

export default function SpotifyCollab(props) {
  const [{ token, setImage, groupId}, dispatch, setUris] = useStateProvider();
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
  const single_uri ='{"uris": ["spotify:track:2HScVhNGt7DltJYrph09Ee"]}';
  var uriVals2 = '';
  const uriVal = '{"uris": ["spotify:track:63dLm0BUpepXeFIfZ0OKEL", "spotify:track:2LO5hQnz5rEaRwkGUvZcHN", "spotify:track:6IpvkngH89cA3hhPC84Leg"]}';
  const urisT = ["2LO5hQnz5rEaRwkGUvZcHN","6IpvkngH89cA3hhPC84Leg", "63dLm0BUpepXeFIfZ0OKEL"]
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
        // console.log(access_token);
    }
    getAuth()
  },[dispatch, token]);
  console.log('tok', tok)
  function parseURIList(uris){
    let parseVal2 = []
    //console.log(uris)
    if (uris) {
      parseVal2 = JSON.parse(uris).uris
      let final = []
      for (const track of parseVal2){
          let temp = ''
          let canAdd = false
          for(let itr = 0; itr < track.length; itr++){
              if (track[itr-1] == ':' && track[itr- 2] == 'k'){
                  canAdd = true
              }
  
              if(canAdd) {
                  temp += track[itr]
              }
          }
          final.push(temp)
      }      
      //console.log(final)
      return final
    }
  }

  
  
  useEffect(() => {
    const sse = new EventSource('http://127.0.0.1:5000/songQueueListen',
      { withCredentials: false });
    
    // sse.addEventListener('message', handleReceiveMessage)


    function getRealtimeData(dataV)  {
      // process the data here,
      // then pass it to state to be rendered
      dispatch({ type: reducerCases.SET_IMAGE, setImage: dataV})

    }

    sse.onmessage = (event) => {
      //console.log('message received')
      getRealtimeData(event.data)
    };
    

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

    
  }, [dispatch, token]);

  return (
  <Container>
    <div className="spotify__body">
      <div className="body" ref={bodyRef} onScroll={bodyScrolled}>
        <Navbar token = {tok} navBackground={navBackground} />
        
        <div className="body__contents">
          <RenderTrack headerBackground={headerBackground} token={tok} uriVal={parseURIList(setImage)}/>
        </div>
      </div>
    </div>
    <div className="spotify__footer">
      <Footer token = {tok} uriVal={setImage}/>
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
