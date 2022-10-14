import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

import styled from "styled-components";
import { BsFonts } from "react-icons/bs";



export default function RenderTrack(props){
    const [{ setMultSongs, setName, setTime, setImage}, dispatch] = useStateProvider();
    const [resp, setResp] = useState('')
    const [sName, setSName] = useState([])
    const [sImg, setSImg] = useState([])
    const [sArtist, setSArtist]  = useState([])
    const [sTime, setSTime] = useState([])
    const tempTracks = "7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B";
    const didMount = useRef(true);

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
                    };
                    tpArr.push(currentPlaying);
                }
                dispatch({ type: reducerCases.SET_MULT_SONGS, setMultSongs: tpArr })
                if(tpArr.length != 0){


                    let renderObj = tpArr.map((item) =>
                    <li key={item.id} style={{listStyleType:"none"}} >
                        <SongPlayer style={{backgroundColor : "#181818"}}> 
                            <div className="image">
                                <img src={item.image} />
                            </div>
                            <div className="info">
                                <h3 className = "song__name">{item.name}</h3>
                                <h5 className="artists__names">{item.artists.join(", ")}</h5>
                            </div>
                        </SongPlayer> 
                    </li>);
                     dispatch({ type: reducerCases.SET_TIME, setTime: renderObj });

                } else {
                    let renderObj = <div></div>
                    dispatch({ type: reducerCases.SET_TIME, setTime: renderObj });
                }

                // let tempSName = []
                // let tempSImg = []
                // let tempSTime = []
                // for(let i = 0; i < setMultSongs.data.tracks.length; i ++){
                //     tempSName.push(setMultSongs.data.tracks[i].name);
                //     tempSImg.push(setMultSongs.data.tracks[i].album.images[2].url)
                //     tempSTime.push(setMultSongs.data.tracks[i].duration_ms)
                // }
    
                // dispatch({ type: reducerCases.SET_NAME, setName: tempSName });
                // dispatch({ type: reducerCases.SET_IMAGE, setImage: tempSImg });
                // dispatch({ type: reducerCases.SET_TIME, setTime: tempSTime });
            } 
        } 
            
        
        getTracks();

    }, [props.token, dispatch]);

    


    
  
        return(
    
            <ListWrapper>
               {setTime}
            </ListWrapper>
        );

    }

const ListWrapper = styled.div`
    display: flex;
    flex-direction: column; 
    width: 100%;
    padding-left:50px;
`
;

const SongPlayer = styled.div`
    display: flex;
    height: 80px;
    flex-direction: row; 
    align-items: center;
    gap : 2rem;
    width: 80%;
    border : none;
    .image {
    }
    .info {
        display: table;
        flex-direction: column;
        align-items: left;
        font-size : 1rem;
        justify-content : center;
        .song__name {
            color : white;

        }
        .artists__names {
            color : white;
        }
    }
`
;
    