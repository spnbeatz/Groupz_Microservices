var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();
const cors = require('cors')
const startConsumer = require("./rabbitmq")
const { Client } = require("elasticsearch");

const esClient = new Client({
    host: process.env.ELASTICSEARCH_URL,
    log: 'trace' 
  });
  
startConsumer(esClient);

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
      return res.status(400).json({ error: "Brak zapytania do wyszukiwania" });
  }

  try {
      const { hits } = await esClient.search({
          index: "search",
          body: {
              query: {
                  bool: {
                      should: [
                          {
                              wildcard: { username: `*${query}*` }
                          },
                          {
                              wildcard: { email: `*${query}*` }
                          }
                      ]
                  }
              }
          }
      });

      const results = hits.hits.map(hit => hit._source);
      console.log(results);
      res.json({ results });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
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

console.log("🔍 Elasticsearch URL:", process.env.ELASTICSEARCH_URL);

module.exports = app;
