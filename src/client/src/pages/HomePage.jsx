import React, { useEffect } from "react";
import styled from "styled-components";

import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";
import {Link} from 'react-router-dom';
import LoginWrapper from "./LoginWrapper";
import PrimaryCreateRoom from "./PrimaryCreateRoom";
import Spotify from "./Spotify";

export default function HomePage() {
  const [{ token, groupId }, dispatch] = useStateProvider();
  useEffect(() => {

  const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
  window.location.hash = '';
    let token = hash;
    if (token.access_token) {
      dispatch({ type: reducerCases.SET_TOKEN, token });
    }
    
    document.title = "Spotify";
  }, [dispatch,token]);
  console.log(token)


  return (
      <div>
          {token ? <PrimaryCreateRoom token = {token.access_token}/> : <Container>
          <Link to='/primary'>
            <button>
                Create Room
            </button>
          </Link>
          <Link to='/joinCode'>
            <button>Join Room</button>
          </Link>
        </Container>}
      </div>

  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #1db954;
  gap: 5rem;
  img {
    height: 20vh;
  }
  button {
    padding: 1rem 5rem;
    border-radius: 5rem;
    background-color: black;
    color: #49f585;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
  }
`;