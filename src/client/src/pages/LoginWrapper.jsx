import React, { useEffect } from "react";
import Login from "./Login";
import Spotify from "./Spotify";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";

export default function LoginWrapper() {
  const [{ token }, dispatch] = useStateProvider();
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
  return (
          <div>
            {token ? <Spotify token = {token.access_token}/> : <Login />}
          </div>
          );
}