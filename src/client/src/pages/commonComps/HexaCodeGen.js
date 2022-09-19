import React from 'react';
import styled from 'styled-components';

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

class HexaCodeGen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currHexCode : 0};
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        if (this.state.currHexCode == 0){
            this.setState(prevState => ({
                currHexCode : Math.floor(100000 + Math.random() * 900000)
            }))
        } 
        
    }
    render() {
      return( <Button onClick = {this.handleClick}> Create Code {String(this.state.currHexCode)} </Button>);
    }
  }

  export default HexaCodeGen