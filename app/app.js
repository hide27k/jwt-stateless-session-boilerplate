'use strict';

const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const boom = require('express-boom');
const jwksClient = require('jwks-rsa');

const items = require('./static/items.json');

dotenv.config();

const cartVerifyJwtOptions = {
  algorithms: ['HS256'],
  maxAge: '1h'
};

const cartSignJwtOptions = {
  algorithm: 'HS256',
  expiresIn: '1h'
};

const idTokenVerifyJwtOptions = {
  algorithms: ['RS256']
};

const jwksOpts = {
  cache: true,
  rateLimit: true,
  jwksUri: `${process.env.AUTH0_API_ISSUER}.well-known/jwks.json`
};
const jwks = jwksClient(jwksOpts);

const app = express();
app.use(boom());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended:true }));

app.use('/protected', expressJwt({
  secret: jwksClient.expressJwtSecret(jwksOpts),
  issuer: process.env.AUTH0_API_ISSUER,
  audience: process.env.AUTH0_API_AUDIENCE,
  requestProperty: 'accessToken',
  getToken: req => {
    return req.cookies['access_token'];
  }
}));

app.use(express.static('static'));

app.post('/auth', (req, res) => {
  res.cookie('access_token', req.body.access_token, {
    httpOnly: true,
    maxAge: req.body.expires_in * 1000
  });
  res.cookie('id_token', req.body.id_token, {
    maxAge: req.body.expires_in * 1000
  });
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('id_token');
  res.redirect('/');
});

app.listen(8000);