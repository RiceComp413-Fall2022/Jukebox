import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
export default function  CurrentTrack(props) {
  function createUri(currId){
    return "spotify:track:" + currId
  }
  const [{ token, currentPlaying, setPrev, setChangeCurr, setGroup, setUUID }, dispatch] = useStateProvider();
  useEffect(() => {
    // console.log(setPrev)
    if(setPrev == undefined && currentPlaying  != undefined){
      console.log("intial render")
      dispatch({ type: reducerCases.SET_PREV, setPrev: currentPlaying})
    }
    if(setPrev != undefined){
      if(setPrev.id !== currentPlaying.id){
        console.log(setPrev)
        console.log(currentPlaying)

          axios.get('/removeSong?userid=' + setUUID + '&roomid=' + setGroup + '&uri=' + createUri(setPrev.id))
          .catch((error) => {
            if (error.response.status === 400) {
              // could not remove song, need to notify user
              console.log("failed to remove song")
            }
          });
          dispatch({type: reducerCases.SET_PREV, setPrev: currentPlaying})
      }
      // console.log(setPrev, "setPrev")
      // console.log(currentPlaying, "current")
    }
  }, [currentPlaying, dispatch])
  useEffect(() => {
    console.log("curr track")
    const getCurrentTrack = async () => {
      console.log(setChangeCurr)
      if(setChangeCurr !== ""){
        const currentPlaying = {
          id: setChangeCurr.id,
          name: setChangeCurr.name,
          artists: setChangeCurr.artists.map((artist) => artist.name),
          image: setChangeCurr.album.images[2].url,
        }
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
      } else {
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
      }
      
      // const response = await axios.get(
      //   "https://api.spotify.com/v1/me/player/currently-playing",
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: "Bearer " + props.token,
      //     },
      //   }
      // );
      // if (response.data !== "") {
      //   const currentPlaying = {
      //     id: response.data.item.id,
      //     name: response.data.item.name,
      //     artists: response.data.item.artists.map((artist) => artist.name),
      //     image: response.data.item.album.images[2].url,
      //   };
      //   dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
      // } else {
      //   dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
      // }
      // console.log(response.data.item.name)
    };
    getCurrentTrack();
  }, [props.token, dispatch, setChangeCurr]);
  
  return ( 
    <Container>
      {currentPlaying && (
        <div className="track">
          <div className="track__image">
            <img src={currentPlaying.image} alt="currentPlaying" width={'100px'} height={'100px'}/>
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
      display: table;
      flex-direction: column;
      gap: 0.3rem;
      &__track__name {
        color : white;
        font-size : 1.2rem;
      }
      &__track__artists {
        color : #b3b3b3;
        font-size : 0.8rem;
      }
    }
  }
`;
