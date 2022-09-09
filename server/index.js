const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configuration
const corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const PORT = 3000;
const HOST = 'localhost';
app.use(cors(corsOptions));
app.use(morgan('dev'));

app.get('/hello', (req, res, _next) => {
  res.send('Alive');
});

app.get('/proxy', (req, res, _next) => {
  const { route } = req.query;
  axios.get(route).then((response) => {
    res.send(response.data);
  });
});

app.post('/proxy', cors(corsOptions), (req, res, _next) => {
  try {
    const { route } = req.query;

    axios
      .post(route)
      .then((response) => {
        res.send(response.data);
      })
      .catch(console.log);
  } catch (err) {
    console.log('ERROR on Proxy Post Request', err.message);
  }
});

app.options('/proxy', cors(corsOptions));

app.post(
  '/login',
  createProxyMiddleware({
    target: 'https://devnet-id.maiar.com/api/v1',
    changeOrigin: true,
  }),
);

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
