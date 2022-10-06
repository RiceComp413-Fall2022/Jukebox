import React from "react";
import styled from "styled-components";
import LoginWrapper from "./LoginWrapper";
// import { Route } from "react-router";
import {BrowserRouter as Link} from 'react-router-dom';

export default function HomePage() {
  const routes  = [
    {
        path: "/login",
        component: LoginWrapper
    }
  ]

  function handlePrim(){
    return(
        <LoginWrapper/>
    )
  }
  function handleCon(){

  }


  return (
    <Container>
        <button onClick={handlePrim}>Primary</button>

        <button onClick={handleCon}>Contributor</button>
    </Container>

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