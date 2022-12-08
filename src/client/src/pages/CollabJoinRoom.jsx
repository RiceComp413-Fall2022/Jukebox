import React, { useRef } from "react";
import styled from "styled-components";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";
import { Link } from 'react-router-dom';
import GLogin from "./GLogin";

export default function CollabJoinRoom(props) {
  const [{ setUUID }, dispatch] = useStateProvider();
  const inputRef = useRef(null);

  function handleClick() {
    dispatch({
      type: reducerCases.SET_GROUP,
      setGroup: inputRef.current.value,
    });
  }

  // google auth clientId
  const clientId = '865635097502-3r9fj984vh1834te8vq6nur5du57k8cb.apps.googleusercontent.com';

  // require Goolge Login until we have a valid userID to use
  if (setUUID === undefined) {
    return (
      <Container>
        <GLogin clientId={clientId} />
      </Container>
    )
  }
  else {
    // there is a valid userID they can now enter the room ID to join

    return (
      <Container>
        <Input ref={inputRef} placeholder="Enter Group ID here" />
        <Link to={{ pathname: '/queueCollab' }}>
          <button onClick={handleClick}>
            Join Room
          </button>
        </Link>
      </Container>
    )
  }
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