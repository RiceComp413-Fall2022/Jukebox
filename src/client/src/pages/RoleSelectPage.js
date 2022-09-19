import React from 'react';
import styled from 'styled-components';
import { loginUrl } from './spotify';

const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
  position: relative;

`;

const Button = styled.button`
  display: inline-block;
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
  display: block;
`;


const RoleSelectPage = () => {

  return (
    <Wrapper>
      <Button> <a href = {loginUrl}> Signin </a></Button>
      <Button>Primary</Button>
      <Button>Collaborator</Button>
    </Wrapper>
  );
};
  
export default RoleSelectPage;