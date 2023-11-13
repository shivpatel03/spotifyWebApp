import './App.css';
import React, { useState, useEffect } from 'react';

const App = () => {
  // const [artistInfo, setArtistInfo] = useState(null);
  const [data, setData] = useState([])

  const url = "https://localhost:3000/artist-information/thekillers"

  const fetchInfo = () => {
    return fetch(url)
      .then((res) => res.json())
      .then((d) => {setData(d)})
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  return (
    <div>
      data
    </div>
  )
}

export default App;
