var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { authenticate } = require("./middlewares/authenticate");

var app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware autentykacji
app.use(authenticate);

// Konfiguracja proxy
const proxyConfig = (target) => {
  if (!target) {
    throw new Error("BŁĄD: Brak 'target' w proxyConfig(). Sprawdź zmienne środowiskowe.");
  }
  return createProxyMiddleware({
    target,
    logger: console,
    changeOrigin: true,
  });
};

console.log("USER_SERVICE:", process.env.USER_SERVICE_URL);
console.log("POSTS_SERVICE:", process.env.POSTS_SERVICE_URL);
console.log("NOTIFICATIONS_SERVICE:", process.env.NOTIFICATIONS_SERVICE_URL);
console.log("CHATS_SERVICE:", process.env.CHATS_SERVICE_URL);
console.log("INTERACTIONS_SERVICE:", process.env.INTERACTIONS_SERVICE_URL);

app.use('/users', (req, res, next) => {
  proxyConfig(process.env.USER_SERVICE_URL)(req, res, next).then(() => {
    console.log("[USER_SERVICE] Redirected to user service");
  });
});

app.use('/posts', (req, res, next) => {
  proxyConfig(process.env.POSTS_SERVICE_URL)(req, res, next).then(() => {
    console.log("[POSTS_SERVICE] Redirected to posts service");
  });
});

app.use('/notifications', (req, res, next) => {
  proxyConfig(process.env.NOTIFICATIONS_SERVICE_URL)(req, res, next).then(() => {
    console.log("[NOTIFICATIONS_SERVICE] Redirected to notifications service");
  });
});

app.use('/chats', (req, res, next) => {
  proxyConfig(process.env.CHATS_SERVICE_URL)(req, res, next).then(() => {
    console.log("[CHATS_SERVICE] Redirected to chats service");
  });
});

app.use('/interactions', (req, res, next) => {
  proxyConfig(process.env.INTERACTIONS_SERVICE_URL)(req, res, next).then(() => {
    console.log("[INTERACTIONS_SERVICE] Redirected to interactions service");
  });
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  console.log(err);
});

module.exports = app;
