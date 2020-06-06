const express = require('express');
const request = require('request');
const router = express.Router();
const FORWARD_HEADERS = ['x-request-id', 'x-b3-traceid', 'x-b3-spanid', 'x-b3-parentspanid', 'x-b3-sampled', 'x-b3-flags', 'x-ot-span-context', 'x-debug']

function createOptions(url, req) {
  let headers = {};
  FORWARD_HEADERS.forEach(function(header) {
    let hVal = req.headers[header];
    if (hVal != null) {
      headers[header] = req.headers[header]
    }
  });
  return {
    url: url,
    headers: headers
  }
}

function tryParseJSON(body) {
  try {
    return JSON.parse(body)
  } catch(err) {
    return null
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let quoteServiceUrl = process.env.QUOTE_SERVICE_URL || "http://localhost:8080"
  let options = createOptions(quoteServiceUrl + "/quote", req);
  request(options, function(err, response, body) {
    if (err) {
      res.render("error", {message: "Unexpected error occurred", error: err})
      return;
    }
    if (!response) {
      res.render("index", {quote: null, error: "Unable to parse response"})
      return;
    }
    let responseBody = tryParseJSON(response.body);
    if (responseBody != null) {
      res.render("index", {quote: responseBody, error: null})
    } else {
      res.render("index", {quote: null, error: response.body})
    }
  })
});

module.exports = router;
