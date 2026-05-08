const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors({
  origin: 'https://angular-assessment-kemisetso.onrender.com',
}));

app.use('/deezer-api', createProxyMiddleware({
  target: 'https://api.deezer.com',
  changeOrigin: true,
  pathRewrite: { '^/deezer-api': '' },
}));

app.listen(process.env.PORT || 3000);
