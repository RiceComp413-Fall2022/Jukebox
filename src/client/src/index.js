import React from 'react';
import ReactDOM from "react-dom";
import './index.css';

import App from "./App.jsx";
import { StateProvider } from "./utils/StateProvider";
import reducer, { initialState } from "./utils/Reducer";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <script src="https://sdk.scdn.co/spotify-player.js"></script> */}
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
