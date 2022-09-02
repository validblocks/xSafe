const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');


// /accounts/erd1qqqqqqqqqqqqqpgq5hfs4zxcvp7rgmwgcjvwg6m2zxpdugcvvcts8rj9zw/delegations?forceRefresh=true

const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";

app.use(morgan('dev'));

app.get('/proxy', (req, res, next) => {
	const { route } = req.query;
	axios.get(route).then(response => {
		res.send(response.data)
	});
});

// app.use('', (req, res, next) => {
// if (req.headers.authorization) {
// 	next();
// } else {
// 	res.sendStatus(403);
// }});

// app.use('/json_placeholder', createProxyMiddleware({
// 	target: API_SERVICE_URL,
// 	changeOrigin: true,
// 	pathRewrite: {
// 		[`^/json_placeholder`]: '',
// 	},
// }));

app.listen(PORT, HOST, () => {
	console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
