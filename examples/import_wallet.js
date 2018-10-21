var request = require('request');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var api_secret = process.env.API_SECRET || '1a2a450cb29bcc2bd3a6cba8729c77c2d90d5dc6';
var api_url = process.env.API_URL || 'http://testnet5.hoste.ro:43001';

var wallets = [{"version":"0.1","address":"WEBD$gDSRHzxo4hSnsxDxZ3q5maccGLgyMeH9fz$","publicKey":"daf3beeb5240a1bbae1247099ccb3b4c4d0b1b3b27c422b64e8d9aebf0d9eee1","privateKey":"809f0528e6ff08d71b8ef931630ff030dd80a65fbbde5d39c2fe854d98fe5e854edaf3beeb5240a1bbae1247099ccb3b4c4d0b1b3b27c422b64e8d9aebf0d9eee1896f1cba"}];

wallets.forEach(function(w, i) {
  var encoded_address = encodeURIComponent(w.address);
  var balance_url = api_url + '/address/balance/' + encoded_address;
  var import_url = api_url + '/' + api_secret + '/wallets/import/' + encoded_address + '/' + w.publicKey + '/' + w.privateKey;

  // Do not import empty wallets
  // Important: Wait 1 second between imports
  setTimeout(function() {
    console.log(balance_url);

    request.get(balance_url, function(err, message, body) {
      var data;

      try {
        data = JSON.parse(body);
      } catch (e) {
        console.error(e);
        return;
      }

      // Do not import wallets that don't have any money
      if (data.balance < 1) return;

      request.get(import_url, function(err, message, body) {
        console.log(import_url);
      });
    });
  }, i * 1000);
});
