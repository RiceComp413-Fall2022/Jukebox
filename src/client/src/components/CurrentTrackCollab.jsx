import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
export default function  CurrentTrack(props) {
  
  const [{ token, currentPlaying, setTrackC, setChangeCurr, setGroup, setUUID }, dispatch] = useStateProvider();

  useEffect(() => {
    // console.log("curr track")
    const getCurrentTrack = async () => {

        const response = await axios.get("/tracks?ids=" + setTrackC,
            {
                // headers: {
                //     Authorization: "Bearer " +  props.token,
                //     "Content-Type" : "application/json"
                // }
            }).catch(function (error) {
                // maybe not the best way to handle this error
                if (error.response.status === 400) {
                    let renderObj = <div></div>
                    dispatch({ type: reducerCases.SET_TIME, setTime: renderObj });
                }
            });

        console.log(response.data.tracks[0].name)

      if(response.data !== ""){
        const currentPlaying = {
          id: response.data.tracks[0].id,
          name: response.data.tracks[0].name,
          artists: response.data.tracks[0].artists.map((artist) => artist.name),
          image: response.data.tracks[0].album.images[2].url,
        }
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
      } else {
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
      }

    

    };

    getCurrentTrack();
  }, [props.token, dispatch, setTrackC]);
  
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
