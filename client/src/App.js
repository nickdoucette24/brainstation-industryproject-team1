import "./App.scss";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL

function App() {
  const [ productList, setProductList ] = useState([]);

  return(
    <>
    </>
  )
}

export default App;
