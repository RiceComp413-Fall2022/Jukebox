import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
// import { Route } from "react-router";
import Spotify from "./Spotify";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

export default function CollabJoinRoom(props) {
  const [{ token, groupId, setGroupId }, dispatch] = useStateProvider();
  const inputRef = useRef(null);
  function handleClick() {
    dispatch({ type: reducerCases.SET_GROUP_ID, groupId: inputRef.current.value });   
    console.log(inputRef.current.value);

  }
  useEffect(() => {
    console.log("groupID", groupId)
    // dispatch({ type: reducerCases.SET_GROUP_ID, groupId: inputRef.current.value });   

  }, [dispatch, groupId]);


  return (
    <Container>
        <Input ref = {inputRef} placeholder="Enter Group ID here" />
        <button onClick={handleClick}>            
            <Link to={{pathname:'/queueCollab'}}>
              Join Room
            </Link>
        </button>
    </Container>
  );
}
const Input = styled.input.attrs(props => ({
    // we can define static props
    type: "text",
  
    // or we can define dynamic ones
    size: props.size || "1em",
  }))`
    color: palevioletred;
    font-size: 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
  
    /* here we use the dynamically computed prop */
    margin: ${props => props.size};
    padding: ${props => props.size};
  `;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #1db954;
  gap: 2rem;
  img {
    height: 20vh;
  }
  button {
    padding: 1rem 3rem;
    border-radius: 5rem;
    background-color: black;
    color: #49f585;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
  }
`;