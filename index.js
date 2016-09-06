const Nightmare = require('nightmare');

var nightmare = Nightmare({ show: false, waitTimeout: 1200000, gotoTimeout: 1200000 });

var completionData = {
  collected: {
    count: null,
    total: null
  },
  chase: null,
  variant: null
};

const selector = {
  tally : '.selected .collected-tally',
  chase : '.selected .chase-count',
  variant : '.selected .variant-count'
}

const config = {
  url : 'https://www.neonmob.com/*/collection/7-deadly-sins/', // /collection/welcome-to-neonmob/
  total : {
    collected : 7,
    chase : 1,
    variant : 8
  }
}

function collectData(callback, url, selector) {
  nightmare
    .goto(url)
    .wait('#neonmob-app')
    .evaluate(function(selector) {

      var tallyHTML = document.querySelector(selector.tally).innerHTML;
      var chaseHTML = document.querySelector(selector.chase).innerHTML;
      var variantHTML = document.querySelector(selector.variant).innerHTML;

      return {
        tally : tallyHTML,
        chase : chaseHTML,
        variant : variantHTML,
      };

    }, selector)
    .end()
    .then(callback)
    .catch(function(error) {
      console.error('Search failed: ', error);
    });
};

function processData(rawData) {
  var tallyRegex    = new RegExp('\t|\n| |<|>|[a-z]|\"|=|', 'g');
  var completeRegex = new RegExp('\t|\n| |<|>|[a-z]|\"|=|\/', 'g');

  rawData.tally   = rawData.tally.replace(tallyRegex, '');
  rawData.chase   = rawData.chase.replace(completeRegex, '');
  rawData.variant = rawData.variant.replace(completeRegex, '');

  rawData.chase   = parseInt(rawData.chase, 10);
  rawData.variant = parseInt(rawData.variant, 10);

  rawData.tally   = rawData.tally.split('/')[0];

  console.log(rawData);
}

var name = 'mtso';
var url = config.url.replace('*', name);

collectData(processData, url, selector);