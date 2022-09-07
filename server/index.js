const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Configuration
const PORT = 3000;
const HOST = 'localhost';
app.use(cors());
app.use(morgan('dev'));

app.get('/proxy', (req, res, _next) => {
  const { route } = req.query;
  axios.get(route).then((response) => {
    res.send(response.data);
  });
});

app.post('/proxy', (req, res, _next) => {
  const { route } = req.query;
  axios.post(route).then((response) => {
    res.send(response.data);
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
