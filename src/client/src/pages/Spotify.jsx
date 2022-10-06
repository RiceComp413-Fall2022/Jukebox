import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar"; 
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import PlayerControls from "../components/PlayerControls";
import RenderTrack from "../components/RenderTrack";

export default function Spotify(props) {
  const [{ token }, dispatch] = useStateProvider();
  const [uriList, setUriList] = useStateProvider(undefined);
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
  const single_uri ='{"uris": ["spotify:track:2HScVhNGt7DltJYrph09Ee"]}';
  const uriVal = '{"uris": ["spotify:track:2LO5hQnz5rEaRwkGUvZcHN", "spotify:track:6IpvkngH89cA3hhPC84Leg", "spotify:track:63dLm0BUpepXeFIfZ0OKEL"]}';
  const urisT = ["2LO5hQnz5rEaRwkGUvZcHN","6IpvkngH89cA3hhPC84Leg", "63dLm0BUpepXeFIfZ0OKEL"]
  function parseURIList(uris){
    let final = []
    let parseVal = JSON.parse(uris).uris
    for (const track of parseVal){
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
    
    return final

  }

  useEffect(() => {
    const getUserInfo = async () => {
      const { data } = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + props.token,
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
  }, [dispatch, props.token]);
  useEffect(() => {
    const getPlaybackState = async () => {
      const { data } = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: "Bearer " + props.token,
          "Content-Type": "application/json",
        },
      });
      dispatch({
        type: reducerCases.SET_PLAYER_STATE,
        playerState: data.is_playing,
      });
    };
    getPlaybackState();
  }, [dispatch, props.token]);
  return (
    <Container>
    <div className="spotify__body">
      <div className="body" ref={bodyRef} onScroll={bodyScrolled}>
        <Navbar navBackground={navBackground} />
        <div className="body__contents">
          <RenderTrack headerBackground={headerBackground} token={props.token} uriVal={parseURIList(uriVal)}/>
        </div>
      </div>
    </div>
    <div className="spotify__footer">
      <Footer token = {props.token} uriVal={uriVal}/>
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
  `;
