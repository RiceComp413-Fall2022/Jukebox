import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import { AiFillClockCircle } from "react-icons/ai";

import styled from "styled-components";
import { BsFonts } from "react-icons/bs";


export default function RenderTrackCollab(props){
    const [{ setMultSongs, setName, setTime, setImage}, dispatch] = useStateProvider();
    const [resp, setResp] = useState('')
    const [sName, setSName] = useState([])
    const [sImg, setSImg] = useState([])
    const [sArtist, setSArtist]  = useState([])
    const [sTime, setSTime] = useState([])
    const tempTracks = "7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B";
    const didMount = useRef(true);

    function changeTime(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return (
        seconds == 60 ?
        (minutes+1) + ":00" :
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds
      );
    }

    useEffect(() =>{
        const getTracks = async() => {
            const response = await axios.get("https://api.spotify.com/v1/tracks?ids=" + props.uriVal,
            {
            headers: {
                Authorization: "Bearer " +  props.token,
                "Content-Type" : "application/json"
            },
            })
            if (response.data != ""){
                console.log("we're in")
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
                dispatch({ type: reducerCases.SET_MULT_SONGS, setMultSongs: tpArr })
                if(tpArr.length != 0){

                    let renderObj = tpArr.map((item, index) =>
                    <li key={item.id} style={{listStyleType:"none"}} >
                        <SongPlayer style={{backgroundColor : "#181818"}}> 
                            <div className="tracks">
                                <div className="row"
                                     key={item.id}
                                     
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

    }, [props.token, dispatch, props.uriVal]); 
    

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
        grid-template-columns: 0.3fr 3fr 3fr 0.1fr;
        margin: 1rem 0 0 0;
        color: white;
        position: sticky;
        top: 15vh;
        padding: 1rem 3rem;
        transition: 0.3s ease-in-out;
        background-color: ${({ headerBackground }) =>
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
            grid-template-columns: 0.3fr 3.1fr 3fr 0.1fr;
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
      }
    }
`
;
    