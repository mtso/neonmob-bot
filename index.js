const express = require('express');
const fs      = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();

app.get('/', function(req, res) {

  // var url = 'http://www.imdb.com/title/tt1229340/';
  var url = 'https://www.neonmob.com/mtso/collection/welcome-to-neonmob/';

  setTimeout(function() {
    request(url).pipe(fs.createWriteStream('saved-timeout.html'));
  }, 30000);


  // request(url).pipe(fs.createWriteStream('saved-timeout.html'));


  // request(url, function(error, response, html) {

  //   // console.log(html);

  //   if (error) { console.log(error); return; }
    
  //   var $ = cheerio.load(html);

  //   console.log($('span.neonmob-logo-text').text());

    

  // })

});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;