import React, { useEffect } from "react";
import WebPlayback from "./components/WebPlayback";
import Login from "./pages/Login";
import Spotify from "./pages/Spotify";
import { reducerCases } from "./utils/Constants";
import { useStateProvider } from "./utils/StateProvider";
import PlzWork from "./components/PlzWork";

export default function App() {
  const [{ token }, dispatch] = useStateProvider();
  useEffect(() => {
  //   const hash = window.location.hash
  //     .substring(1)
  //     .split('&')
  //     .reduce(function (initial, item) {
  //       if (item) {
  //         var parts = item.split('=');
  //         initial[parts[0]] = decodeURIComponent(parts[1]);
  //       }
  //       return initial;
  // }, {});

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

// Set token
    let token = hash;
    if (token.access_token) {
      dispatch({ type: reducerCases.SET_TOKEN, token });
    }
    
    document.title = "Spotify";
  }, [dispatch,token]);
  return (
          <div>
            {token ? <Spotify token = {token.access_token}/> : <Login />}
          </div>
          );
}