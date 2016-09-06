const Nightmare = require('nightmare');
const app       = require('express')();
app.use(require('body-parser').urlencoded({ extended: true }));

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
//   url : 'https://www.neonmob.com/*/collection/7-deadly-sins/',
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
  var nightmare = Nightmare({ show: false, waitTimeout: 30000, gotoTimeout: 30000 })
  nightmare
    .goto(url)
    .wait('ul.selected')
    .evaluate(function(selector) {
      
      var tallyHTML = null
        , chaseHTML = null
        , variantHTML = null;

      if (document.querySelector(selector.tally)) {
        tallyHTML = document.querySelector(selector.tally).innerHTML;
      }
      if (document.querySelector(selector.chase)) {
        chaseHTML = document.querySelector(selector.chase).innerHTML;
      }
      if (document.querySelector(selector.variant)) {
        variantHTML = document.querySelector(selector.variant).innerHTML;
      }

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
  
  var tallyStrings;
  var chaseString;
  var variantString;

  if (rawData.tally) {
    tallyStrings = rawData.tally.replace(tallyRegex, '').split('/');
    completionData.collected.count = parseInt(tallyStrings[0], 10);
    completionData.collected.total = parseInt(tallyStrings[1], 10);
  }
  if (rawData.chase) {
    chaseString = rawData.chase.replace(completeRegex, '');
    completionData.chase = parseInt(chaseString, 10);
  }
  if (rawData.variant) {
    variantString = rawData.variant.replace(completeRegex, '');
    completionData.variant = parseInt(variantString, 10);
  }

  console.log(completionData);
}


app.get('/', function(req, res) {

  res.sendFile(__dirname + '/index.html');

});

app.post('/submit', function(req, res) {

  var name = req.body.name;
  var url = config.url.replace('*', name);

  // function sendData() {
  //   res.send(completionData);
  // }

  collectData(function(rawData) {

    const tallyRegex    = new RegExp('\t|\n| |<|>|[a-z]|\"|=|', 'g');
    const completeRegex = new RegExp('\t|\n| |<|>|[a-z]|\"|=|\/', 'g');
    
    var tallyStrings;
    var chaseString;
    var variantString;

    if (rawData.tally) {
      tallyStrings = rawData.tally.replace(tallyRegex, '').split('/');
      completionData.collected.count = parseInt(tallyStrings[0], 10);
      completionData.collected.total = parseInt(tallyStrings[1], 10);
    }
    if (rawData.chase) {
      chaseString = rawData.chase.replace(completeRegex, '');
      completionData.chase = parseInt(chaseString, 10);
    }
    if (rawData.variant) {
      variantString = rawData.variant.replace(completeRegex, '');
      completionData.variant = parseInt(variantString, 10);
    }

    res.send(completionData);

  }, url, selector);

})

app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on *:' + (process.env.PORT || 3000));
});