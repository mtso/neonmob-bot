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


// const config = {
//   url : 'https://www.neonmob.com/*/collection/7-deadly-sins/', // /collection/welcome-to-neonmob/
//   total : {
//     collected : 7,
//     chase : 1,
//     variant : 8
//   }
// }


const config = {
  url : 'https://www.neonmob.com/*/collection/tik-tok-time/',
  total : {
    visible : 29,
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
  const tallyRegex    = new RegExp('\t|\n| |<|>|[a-z]|\"|=|', 'g');
  const completeRegex = new RegExp('\t|\n| |<|>|[a-z]|\"|=|\/', 'g');

  tallyStrings  = rawData.tally.replace(tallyRegex, '').split('/');
  chaseString   = rawData.chase.replace(completeRegex, '');
  variantString = rawData.variant.replace(completeRegex, '');

  completionData.collected.count = parseInt(tallyStrings[0], 10);
  completionData.collected.total = parseInt(tallyStrings[1], 10);
  completionData.chase = parseInt(chaseString, 10);
  completionData.variant = parseInt(variantString, 10);

  console.log(completionData);
}

var name = 'mtso';
var url = config.url.replace('*', name);

collectData(processData, url, selector);