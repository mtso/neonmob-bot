const Nightmare = require('nightmare');
const $         = require('jQuery');

var nightmare = Nightmare({ show: true, waitTimeout: 60000 });

// https://www.neonmob.com/mtso/collection/welcome-to-neonmob/
// https://www.neonmob.com/mtso/collection/7-deadly-sins/

var url = 'https://www.neonmob.com/mtso/collection/7-deadly-sins/';

/*
nightmare
  .goto(url)
  .wait('#neonmob-app')
  .evaluate(function() {
    return document.querySelector('.selected .collected-tally').innerHTML;
  })
  .end()
  .then(function(result) {
    console.log(result);
  })
  .catch(function(error) {
    console.error('Search failed: ', error);
  });

nightmare
  .goto(url)
  .wait('#neonmob-app')
  .evaluate(function() {
    return document.querySelector('.selected .variant-count').innerHTML;
  })
  .end()
  .then(function(result) {
    console.log(result);
  })
  .catch(function(error) {
    console.error('Search failed: ', error);
  });
/**/

/*
function getTally() {
  nightmare
    .goto(url)
    .wait('#neonmob-app')
    .evaluate(function() {
      return document.querySelector('.selected .collected-tally').innerHTML;
    })
    .end()
    .then(function(result) {
      console.log(result);
      return result;
    })
    .catch(function(error) {
      console.error('Search failed: ', error);
    });
}

function getChase() {
  nightmare
    .goto(url)
    .wait('#neonmob-app')
    .evaluate(function() {
      return document.querySelector('.selected .chase-count').innerHTML;
    })
    .end()
    .then(function(result) {
      console.log(result);
      return result;
    })
    .catch(function(error) {
      console.error('Search failed: ', error);
    });
}

function getVariant() {
  nightmare
    .goto(url)
    .wait('#neonmob-app')
    .evaluate(function() {
      return document.querySelector('.selected .variant-count').innerHTML;
    })
    .end()
    .then(function(result) {
      console.log(result);
      return result;
    })
    .catch(function(error) {
      console.error('Search failed: ', error);
    });
}
/**/

function innerHtmlWithSelector(callback, url, selector) {
  // nightmare
  (new Nightmare({ show: false, waitTimeout: 60000 }))
    .goto(url)
    .wait('#neonmob-app')
    .evaluate(function(selector) {
      return document.querySelector(selector).innerHTML;
    }, selector)
    .end()
    .then(function(result) {
      // console.log(result);
      // return result;
      callback(result);
    })
    .catch(function(error) {
      console.error('Search failed: ', error);
    });
};

function log(string) {
  console.log(string);
}



innerHtmlWithSelector(log, url, '.selected .variant-count');
innerHtmlWithSelector(log, url, '.selected .chase-count');
innerHtmlWithSelector(log, url, '.selected .collected-tally');