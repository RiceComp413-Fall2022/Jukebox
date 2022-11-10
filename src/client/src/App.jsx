import React from "react";
import HomePage from "./pages/HomePage";
import axios from 'axios';



export default function App() {
  
  axios.defaults.baseURL = "http://localhost:5000/"; 

  return (
      <div>
        <HomePage/>
      </div>
  );
}