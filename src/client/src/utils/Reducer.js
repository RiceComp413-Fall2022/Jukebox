import { reducerCases } from "./Constants";

export const initialState = {
  token: null,
};

const reducer = (state, action) => {
    switch (action.type) {
      case reducerCases.SET_TOKEN:
        return {
          ...state,
          token: action.token,
        };
      case reducerCases.SET_USER:
        return {
          ...state,
          userInfo: action.userInfo,
        };
      case reducerCases.SET_PLAYLISTS:
        return {
          ...state,
          playlists: action.playlists,
        };
      case reducerCases.SET_PLAYING:
        return {
          ...state,
          currentPlaying: action.currentPlaying,
        };
      case reducerCases.SET_PLAYER_STATE:
        return {
          ...state,
          playerState: action.playerState,
        };
      case reducerCases.SET_PLAYLIST:
        return {
          ...state,
          selectedPlaylist: action.selectedPlaylist,
        };
      case reducerCases.SET_PLAYLIST_ID:
        return {
          ...state,
          selectedPlaylistId: action.selectedPlaylistId,
        };
      case reducerCases.SET_DEVICE_ID:
        return {
          ...state,
          selectedPlaylistId: action.selectedPlaylistId,
        };
      case reducerCases.SET_MULT_SONGS:
        return{
          ...state,
          setMultSongs: action.setMultSongs,
        }

      case reducerCases.SET_NAME:
        return{
          ...state,
          setName: action.setName,
        }

      case reducerCases.SET_IMAGE:
        return{
          ...state,
          setImage: action.setImage,
        }
      
      case reducerCases.SET_TIME:
        return{
          ...state,
          setTime: action.setTime,
        }

      case reducerCases.SET_URIS:
        return{
          ...state,
          setUris: action.setUris,
        }
  

      default:
        return state;
    }
  };
  
  export default reducer;