import React, { Component, useState, useEffect, useRef } from 'react';
import {Card} from 'antd';
import './SearchBar.css';
import { Input, List, Avatar } from 'antd';
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import styled from "styled-components";
import axios from "axios";

import 'antd/dist/antd.css';


const { Search } = Input;



export default function SearchBar(props){
const [{ setGroup, setUUID }, dispatch] = useStateProvider();
const [image, setImage] = useState([]);
console.log(props.token)

function parseURI(uri){
  let final = []
  let temp = ''
  let canAdd = false
  for(let itr = 0; itr < uri.length; itr++){
      if (uri[itr-1] == ':' && uri[itr- 2] == 'k'){
          canAdd = true
      }

      if(canAdd) {
          temp += uri[itr]
      }
  }
  final.push(temp)
  
  
  return final

}

  function getSearchResults(query){

    const access_token = props.token;
    const searchQuery = query;
    console.log("Search Query: " + searchQuery.toString())
    const fetchURL = encodeURI(`q=${searchQuery}`);
    // this.state = {
    //     token: props.token,
    //     searchResults: [] 
    // }
    fetch(`https://api.spotify.com/v1/search?${fetchURL}&type=track&limit=5`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`     
        }
      }
    )
    .then(response => {
      if(!response.ok){
        throw Error("Response Not Ok")
      }
      return response;
    })
    .then(response => response.json())
    .then(({tracks}) => {
      const results = [];
      console.log(tracks)
      tracks.items.forEach(element => {
        let artists = []
        element.artists.forEach(artist => artists.push(artist.name))
        results.push(   
          <div onClick={() => axios.get('/addSong?userid=' + setUUID + '&roomid=' + setGroup + '&uri=' + element.uri,
          { withCredentials: false })}>
            <li key={element.uri}  >
              <List.Item.Meta 
                avatar={<Avatar shape='square' size='large' src={element.album.images[0].url} />}
                title={<p href="https://ant.design">{element.name}</p>}
                description={artists.join(', ')}
              />
            </li>
          </div>);
      });
      setImage(results)
    })
    .catch(error => setImage([]))
    
  }
// },[props.token, dispatch])
    let card;
    function renderCards(){     
        if(image.length > 0){
          card = 
          <div>
            <Card>
              <List itemLayout="horizontal" >
                {image}
              </List>
            </Card>;
          </div>
        }
        else {
          card = <Card hidden={true}/>;
        }
    }

   renderCards()

    return (
      <div className="App">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <div className="Search" style={{'height' : '30px', 'width' : '300px', 'paddingTop' : '7px'}}>
          <Search
            placeholder="Artists or Tracks"
            enterButton="Search"
            size="small"
            onChange={value => getSearchResults(value.target.value)}
            onSearch={value => console.log(value)}
          />
          <div/>
            {image.length != 0 && (
              <div className="dataResult" style={{'paddingTop' : '5px'}}>
                {card}
              </div>
            )}
        </div>
       
    </div>
    );
  }

const dataResult = styled.div`
  display : flex;
`

