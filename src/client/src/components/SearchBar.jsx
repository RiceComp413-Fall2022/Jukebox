import React, { Component, useState, useEffect } from 'react';
import {Card} from 'antd';
import './SearchBar.css';
import { Input, List, Avatar } from 'antd';
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

import 'antd/dist/antd.css';


const { Search } = Input;

export default function SearchBar(props){
const [dispatch] = useStateProvider();
const [image, setImage] = useState([]);
console.log(props.token)



  function getSearchResults(query){

    const access_token = props.token;
    const searchQuery = query;
    console.log("Search Query: " + searchQuery.toString())
    const fetchURL = encodeURI(`q=${searchQuery}`);
    // this.state = {
    //     token: props.token,
    //     searchResults: [] 
    // }
    fetch(`https://api.spotify.com/v1/search?${fetchURL}&type=track`, {
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
      console.log(tracks.items[0].name);
      const results = [];
      tracks.items.forEach(element => {
        let artists = []
        element.artists.forEach(artist => artists.push(artist.name))
        results.push(      
          <List.Item key={element.uri}>
            <List.Item.Meta
              avatar={<Avatar shape='square' size='large' src={element.album.images[0].url} />}
              title={<p href="https://ant.design">{element.name}</p>}
              description={artists.join(', ')}
            />
          </List.Item>);
      });
      setImage(results)
    })
    .catch(error => setImage([]))
    
  }
// },[props.token, dispatch])
    let card;
    function renderCards(){
        console.log("res", image)
        if(image.length > 0){
          card = <Card>
            <List itemLayout="horizontal">
              {image}
            </List>
          </Card>;
        }
        else {
          card = <Card hidden={true}/>;
        }
    }
    useEffect(() => {
        renderCards();
    })

    return (
      <div className="App">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <div className="Search">
          <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            onChange={value => getSearchResults(value.target.value)}
            onSearch={value => console.log(value)}
          />
          {card}
        </div>
      </div>
    );
  }


