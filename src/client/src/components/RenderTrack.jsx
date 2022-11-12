import axios from "axios";
import React, { useEffect } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { blue} from '@mui/material/colors';

import styled from "styled-components";
import RemoveButton from "./RemoveSong"
import parseURIList from "../utils/Util";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function RenderTrack(props){
    const [{ setMultSongs, setTime, setGroup, setUUID, token}, dispatch] = useStateProvider();

    function changeTime(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);

        return (
            seconds == 60 ?
            (minutes+1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        );
    }

    const playTrack = async(
        id,
        name,
        artists,
        image,
        context_uri,
        track_number
    ) => {
        const response = await axios.put(
            `https://api.spotify.com/v1/me/player/play`,
            {
                context_uri,
                offset: {
                    position: track_number - 1,
                },
                position_ms: 0,
            },
            {
                headers: {
                    Authorization: "Bearer " + token.access_token,
                    "Content-Type": "application/json",
                    
                },
            }
        );

        if (response.status === 204) {
            const currentPlaying = {
                id,
                name,
                artists,
                image
            };

            dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
            dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });

        } else {
            
            dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
        }
    };

    useEffect(() =>{
        const getTracks = async() => {
            if (setMultSongs == undefined) {
                let renderObj = <div></div>
                dispatch({ type: reducerCases.SET_TIME, setTime: renderObj });
                return; 
            }
            
            // check if we even have any songs to get
            const response = await axios.get("https://api.spotify.com/v1/tracks?ids=" + parseURIList(setMultSongs),
            {
                headers: {
                    Authorization: "Bearer " +  props.token,
                    "Content-Type" : "application/json"
                }
            }).catch(function (error) {
                // maybe not the best way to handle this error
                if (error.response.status === 400) {
                    let renderObj = <div></div>
                    dispatch({ type: reducerCases.SET_TIME, setTime: renderObj });
                }
            });

            if (response != undefined && response.data != ""){
                let tpArr = []
                for(let i = 0; i < response.data.tracks.length; i ++) {
                    const currentPlaying = {
                      id: response.data.tracks[i].id,
                      name: response.data.tracks[i].name,
                      artists: response.data.tracks[i].artists.map((artist) => artist.name),
                      image: response.data.tracks[i].album.images[2].url,
                      album : response.data.tracks[i].album.name,
                      duration : response.data.tracks[i].duration_ms,
                      context_uri : response.data.tracks[i].album.uri,
                      track_number : response.data.tracks[i].track_number
                    };
                    tpArr.push(currentPlaying);
                }
                if(tpArr.length != 0){

                    let renderObj = tpArr.map((item, index) =>
                    <li key={item.id} style={{listStyleType:"none"}} >
                        <SongPlayer style={{backgroundColor : "#181818"}}> 
                            <div className="tracks">
                                <div className="row"
                                     key={item.id}
                                     onClick={() =>
                                        playTrack(
                                            item.id,
                                            item.name,
                                            item.artists,
                                            item.image,
                                            item.context_uri,
                                            item.track_number
                                        )
                                     }
                                >
                                    <div className="col">
                                        <span> {index + 1}</span>
                                    </div>
                                    <div className="col detail">
                                        <div className="image">
                                            <img src={item.image} alt='track'/>
                                        </div>
                                        <div className="info">
                                            <span className = "song__name">{item.name}</span>
                                            <span className="artists__names">{item.artists.join(", ")}</span>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <span>{item.album}</span>
                                    </div>
                                    <div className="col">
                                        <span>{changeTime(item.duration)}</span>
                                    </div>    
                                    <RemoveButton color={blue[200]} userId={setUUID} uri={"spotify:track:" + item.id} roomId={setGroup}/>
                                </div>
                            </div>
                        </SongPlayer> 
                    </li>);

                     dispatch({ type: reducerCases.SET_TIME, setTime: renderObj });

                } else {
                    let renderObj = <div></div>
                    dispatch({ type: reducerCases.SET_TIME, setTime: renderObj });
                }
            } 
        }    
        getTracks()

    }, [token.access_token, setMultSongs, dispatch]); 
    

        //console.log(setTime)

        return(

            <ListWrapper>
            <div className="header-row">
                <div className="col">
                    <span>#</span>
                </div>
                <div className="col">
                    <span>TITLE</span>
                </div>
                <div className="col">
                    <span>ALBUM</span>
                </div>
                <div className="col">
                    <span>
                        <AiFillClockCircle />
                    </span>
                </div>
            </div>
            
            {setTime}
            </ListWrapper>
    
        );

    }

const ListWrapper = styled.div`
    display: flex;
    flex-direction: column; 
    width: 95%;
    padding-left:50px;

     .header-row {
        display: grid;
        grid-template-columns: 0.3fr 3fr 3fr 0.1fr .5fr;
        margin: 1rem 0 0 0;
        color: white;
        position: sticky;
        top: 15vh;
        padding: 1rem 3rem;
        transition: 0.3s ease-in-out;
        backgroundcolor: ${({ headerBackground }) =>
          headerBackground ? "#000000dc" : "none"};
    }
`
;
    
const SongPlayer = styled.div`
    .tracks {
        margin: 0 2rem;
        display: flex;
        flex-direction: column;
        .row {
            padding: 0.5rem 1rem;
            display: grid;
            grid-template-columns: 0.3fr 3.1fr 3fr 0.1fr .5fr;
            &:hover {
            background-color: rgba(0, 0, 0, 0.7);
        }
        .col {
          display: flex;
          align-items: center;
          color: #dddcdc;
          img {
            height: 50px;
            width: 50px;
          }
        }
        .detail {
          display: flex;
          gap: 1rem;
          .info {
            display: flex;
            flex-direction: column;
          }
        }
        .remove {
            display: flex;
            align-items: center;
            color: #dddcdc;
            img {
                height: 50px;
                width: 50px;
            }
            margin-left: 2em;
            margin-right: auto;
        }
      }
    }
`
;
    

    