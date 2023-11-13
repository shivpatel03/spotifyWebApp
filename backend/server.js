const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
require('dotenv').config();

// const accessToken = require('./accessToken');


const clientID = 'ea61cb91b6f5447cb3c069ec2ac71dd7';
const clientSecret = process.env.CLIENTSECRET;
const spotifyApi = 'https://accounts.spotify.com/api/token';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cors());

app.use((req,res,next) => {
  console.log(req.path, req.method)
  next()
})
// app.use(cors()); 


// getting the access token using clientID and secret
const getAccessToken = async () => {
  try {
    const response = await axios.post(spotifyApi, null, {
      params: {
        grant_type: 'client_credentials',
      },
      auth: {
        username: clientID,
        password: clientSecret,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error);
    throw error;
  }
};

let accessToken;

getAccessToken().then((token) => {
  accessToken = token;
});

app.get('/artist/:id', async(req,res) => {
  const artistId = req.params.id;

  try{
    const response = await axios.get(`https://api.spotify.com/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    res.json({ response })
  } catch (error) {
    console.error('Error getting artist information', error);
    res.status(500).json({ error: 'Unable to fetch artist information' })
  }
});

app.get('/artist-information/:name', async (req, res) => {
  artistName = req.params.name;
  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: artistName,
        type: 'artist',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    // get FIRST search result
    const artist = response.data.artists.items[0];

    if (!artist) {
      throw new Error('Artist not found');
    }

    followers = artist.followers.total;
    nameOfArtist = artist.name;
    popularity = artist.popularity;
    uri = artist.uri;
    genres = artist.genres;
    const artistInfo = { followers, nameOfArtist, popularity, uri, genres };
    res.json(artistInfo);
  } catch (error) {
    console.error('Error searching for the artist:', error);
    throw error;
  }
});