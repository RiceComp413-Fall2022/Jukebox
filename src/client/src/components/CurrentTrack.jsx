import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
export default function  CurrentTrack(props) {
  const [{ token, currentPlaying, setGroup, setUUID, setPrev }, dispatch] = useStateProvider();
  function createUri(currId){
    return "spotify:track:" + currId
  }
  useEffect(() => {
    // console.log(setPrev)
    if(setPrev == undefined && currentPlaying  != undefined){
      console.log("intial render")
      dispatch({ type: reducerCases.SET_PREV, setPrev: currentPlaying})
    }
    if(setPrev != undefined){
      if(setPrev.id !== currentPlaying.id){
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
  }, [dispatch, currentPlaying, setPrev])
  useEffect(() => {

    const getCurrentTrack = async () => {
      
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        }
      );
      if (response.data !== "") {
        const currentPlaying = {
          id: response.data.item.id,
          name: response.data.item.name,
          artists: response.data.item.artists.map((artist) => artist.name),
          image: response.data.item.album.images[2].url,
        };
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
      } else {
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
      }
    };
    // if (currentPlaying !== undefined){
    //   dispatch({ type: reducerCases.SET_PREV, setPrev: currentPlaying})
    // }
    // console.log(setPrev, "setPrev")
    getCurrentTrack();
    // console.log(currentPlaying, "current")
    // if(temp !== ''){
    //   console.log(temp)
    //   if(temp.id !== currentPlaying.id){
    //     console.log(temp)
        // axios.get('/removeSong?userid=' + setUUID + '&roomid=' + setGroup + '&uri=' + temp.)
		    // .catch((error) => {
        //   if (error.response.status === 400) {
        //     // could not remove song, need to notify user
        //     console.log("failed to remove song")
        //   }
		    // });
    //   }
    // }
    // console.log(currentPlaying.id, "tp");
  }, [dispatch]);
  
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
