import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import { AiFillClockCircle } from "react-icons/ai";
import { blue} from '@mui/material/colors';

import styled from "styled-components";
import { BsFonts } from "react-icons/bs";
import RemoveButton from "./RemoveSong"


export default function RenderTrackCollab(props){
    const [{ setMultSongs, setName, setTime, setImage, setGroup}, dispatch] = useStateProvider();
    const [sName, setSName] = useState([])
    const [resp, setResp] = useState('')
    const [sImg, setSImg] = useState([])
    const [sArtist, setSArtist]  = useState([])
    const [sTime, setSTime] = useState([])
    const tempTracks = "7ouMYWpwJ4s22jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B";
    const didMount = useRef(true);
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
            console.log(props.uriVal)
            const response = await axios.get("https://api.spotify.com/v1/tracks?ids=" + parseURIList(setMultSongs),
                {
                    headers: {
                        Authorization: "Bearer " +  props.token,
                        "Content-Type" : "application/json"
                    },
                }
            ).catch(function (error) {
                if (error.response.status === 400) {
                    let renderObj = <div></div>
                    dispatch({ type: reducerCases.SET_TIME, setTime: renderObj });
                }
            });
            if (response != undefined && response.data != ""){
                console.log(response.data.tracks[0].name, "rep")
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
                                        <span> {changeTime(item.duration)} </span>
                                    </div>
                                    <RemoveButton color={blue[200]} uri={"spotify:track:" + item.id} roomId={setGroup}/>
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

    }, [props.token, dispatch, setMultSongs]); 
    

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
    