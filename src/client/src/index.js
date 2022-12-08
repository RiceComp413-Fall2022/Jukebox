import React from 'react';
import ReactDOM from "react-dom";
import './index.css';

import App from "./App.jsx";
import LoginWrapper from "./pages/LoginWrapper";
import Spotify from "./pages/Spotify";
import { StateProvider } from "./utils/StateProvider";
import reducer, { initialState } from "./utils/Reducer";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SpotifyCollab from './pages/SpotifyCollab';
import CollabJoinRoom from './pages/CollabJoinRoom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <script src="https://sdk.scdn.co/spotify-player.js"></script> */}
    <BrowserRouter>

      <StateProvider initialState={initialState} reducer={reducer}>
        <Routes>
          <Route path='/' element={<App />}></Route>
          <Route path='queueMain' element={<Spotify />}></Route>
          <Route path='queueCollab' element={<SpotifyCollab />}></Route>
          <Route path='primary' element={<LoginWrapper />}></Route>
          <Route path='joinCode' element={<CollabJoinRoom />}></Route>

        </Routes>
      </StateProvider>
    </BrowserRouter>

  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

