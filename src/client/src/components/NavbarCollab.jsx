import React,  {useEffect,  useId, useState} from "react";
import styled from "styled-components";
import  axios from "axios";
import {Card} from 'antd';
import { useStateProvider } from "../utils/StateProvider";
import SearchBar from "./SearchBar";
import { FaSearch } from "react-icons/fa";
import $ from 'jquery'; 
import { CgProfile } from "react-icons/cg";
import { Input, List, Avatar } from 'antd';

const { Search } = Input;


export default function NavbarCollab(props) {
  const [{ userInfo }] = useStateProvider();
  const [{ token, currentPlaying }, dispatch] = useStateProvider();
  const id = useId();
  const [input, setInput] = useState(props?.value ?? '');
  console.log("Tok", props.token)

  function getSearchResults(query){
    const access_token = props.token ;
    const searchQuery = query;
    console.log("Search Query: " + searchQuery.toString())
    const fetchURL = encodeURI(`q=${searchQuery}`);
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
      this.setState({
        searchResults: results
      });
    })
    .catch(error => this.setState({
        searchResults: []
      })
    )

  }
  function render() {
    let card;
    if(this.state.searchResults.length > 0){
      card = <Card>
        <List itemLayout="horizontal">
          {this.state.searchResults}
        </List>
      </Card>;
    }
    else {
      card = <Card hidden={true}/>;
    }
    return (
      <div className="App">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div className="Search">
          <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            onChange={value => this.getSearchResults(value.target.value)}
            onSearch={value => console.log(value)}
          />
          {card}
        </div>
      </div>
    );
  }

  // const getTrack = async(track) => { 
  //   const state = playerState ? "pause" : "play";
  //   $.ajax({
  //       url: "https://api.spotify.com/v1/search?q=" + track,
  //       type: "GET",
  //       beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + props.token);},
  //       success: function(data) { 
  //         console.log(data)
  //       }
  //   });
  // };
  return (
    <Container navBackground={props.navBackground}>
      <div>
        <SearchBar token = {props.token}/>
      </div>  
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  height: 15vh;
  position: sticky;
  top: 0;
  transition: 0.3s ease-in-out;
  background-color: ${({ navBackground }) =>
    navBackground ? "rgba(0,0,0,0.7)" : "none"};
  .search__bar {
    background-color: white;
    width: 30%;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    input {
      border: none;
      height: 2rem;
      width: 100%;
      &:focus {
        outline: none;
      }
    }
  }
  .avatar {
    background-color: black;
    padding: 0.3rem 0.4rem;
    padding-right: 1rem;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: white;
      font-weight: bold;
      svg {
        font-size: 1.3rem;
        background-color: #282828;
        padding: 0.2rem;
        border-radius: 1rem;
        color: #c7c5c5;
      }
    }
  }
`;