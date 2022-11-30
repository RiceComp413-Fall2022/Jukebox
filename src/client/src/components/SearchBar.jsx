import React, { useEffect, useState } from "react";
import { Card } from "antd";
import "./SearchBar.css";
import { Input, List, Avatar } from "antd";
import { useStateProvider } from "../utils/StateProvider";
import styled from "styled-components";
import axios from "axios";

import "antd/dist/antd.css";

const { Search } = Input;

export default function SearchBar() {
  const [{ setGroup, setUUID }, dispatch] = useStateProvider();
  const [image, setImage] = useState([]);
  const [clicked, setClicked] = useState(false); // designates whether a song has just been selected

  function getSearchResults(query) {
    const searchQuery = query;
    const fetchURL = encodeURI(`q=${searchQuery}`);

    console.log("Search Query: " + searchQuery.toString());

    // If the search query is empty we don't need to search for it
    if (searchQuery.toString() == "") {
      setImage(<div></div>);
      return;
    }

    axios.get(`/search?${fetchURL}`)
      .catch(function (error) {
        setImage([]);
        throw Error("Response Not Ok: " + error);
      })
      .then((response) => response.data.tracks)
      .then((tracks) => {
        const results = [];

        tracks.items.forEach((element) => {
          let artists = [];
          element.artists.forEach((artist) => artists.push(artist.name));

          results.push(
            <div
              onClick={() => {
                axios.get(`/addSong?userid=${setUUID}&roomid=${setGroup}&uri=${element.uri}`,
                  { withCredentials: false }
                );
                // clear the search bar and remove the results box
                setClicked(true);
                setImage(<div></div>);
                return;
              }}
            >
              <Container>
                <li className="tracks" key={element.uri} style = {{'border-bottom' : 'solid', 'border-width' : '2px', 'marginTop' : '10px'}}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        size="large"
                        src={element.album.images[0].url}
                      />
                    }
                    title={<p href="https://ant.design">{element.name}</p>}
                    description={artists.join(", ")}
                  />
                </li>
              </Container>
            </div>
          );
        });
        setImage(results);
      });
  }

  // reset clicked after the click
  useEffect(() => {
    if (clicked) setClicked(false);
  });

  let card;
  function renderCards() {
    if (image.length > 0) {
      card = (
        <div>
          <Card>
            <List itemLayout="horizontal">{image}</List>
          </Card>
          ;
        </div>
      );
    } else {
      card = <Card hidden={true} />;
    }
  }

  renderCards();

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <div
        className="Search"
        style={{ height: "30px", width: "300px", paddingTop: "7px" }}
      >
        {clicked && ( // if a song was just selected then clear the search box
          <Search
            placeholder="Artists or Tracks"
            enterButton="Search"
            size="small"
            onChange={(value) => getSearchResults(value.target.value)}
            value="" // clear search box
          />
        )}
        {!clicked && ( // wasn't just clicked so normal search box
          <Search
            placeholder="Artists or Tracks"
            enterButton="Search"
            size="small"
            onChange={(value) => getSearchResults(value.target.value)}
          />
        )}
        <div />
        {image.length != 0 && (
          <div className="dataResult" style={{ 'paddingTop' : "3px", 'width' : '100%' }}>
            {card}
          </div>
        )}
      </div>
    </div>
  );
}


const Container = styled.div`
.tracks {
    &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    }
  }
`
