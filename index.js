const Nightmare = require('nightmare');
const app       = require('express')();

// var nightmare = Nightmare({ show: false, waitTimeout: 1200000, gotoTimeout: 1200000 });

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

// var name = 'mtso';
// var url = config.url.replace('*', name);

function collectData(callback, url, selector) {
  var nightmare = Nightmare({ show: false, waitTimeout: 30000, gotoTimeout: 30000 })
  nightmare
    .goto(url)
    .wait(function(selector) {

      if (document.querySelector(selector.tally) && 
          document.querySelector(selector.chase) &&
          document.querySelector(selector.variant)) {
        return true;
      } else {
        return false;
      }

    }, selector)
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
  if (rawData == null) {
    console.log(rawData);
    collectData(processData, url, selector);
    return; 
  }

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

// collectData(processData, url, selector);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');

  if (req.query['username']) {

    console.log(req.query['username']);

    var name = req.query['username'];
    var url = config.url.replace('*', name);

    collectData(processData, url, selector);
  }
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on *:' + (process.env.PORT || 3000));
});