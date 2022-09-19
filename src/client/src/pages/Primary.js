import HexaCodeGen from "./commonComps/HexaCodeGen";
import { loginUrl } from "./spotify";
import styled from 'styled-components';
import SpotifyPlayer from 'react-spotify-web-playback'

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

const size = {
  width: "100%",
  height: 300
};
const view = "list"; // or 'coverart'
const theme = "black"; // or 'white'

const Primary = () => {
  return(
    <Wrapper>
      <Button> <a href = {loginUrl}> Signin </a></Button>
      <HexaCodeGen></HexaCodeGen>
      <SpotifyPlayer
        uri="spotify:show:2RXY5kEKWQobky1Y2dSUyF"
        size={size}
        view={view}
        theme={theme}
      />
      <SpotifyPlayer
        uri="spotify:show:2RXY5kEKWQobky1Y2dSUyF"
        size={size}
        view={view}
        theme={theme}
      />
      {/* <Spotify link="https://open.spotify.com/album/0fUy6IdLHDpGNwavIlhEsl?si=mTiITmlHQpaGkoivGTv8Jw" /> */}
    </Wrapper>
  ); 
};

    
  export default Primary;