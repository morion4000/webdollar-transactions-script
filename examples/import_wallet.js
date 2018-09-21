var request = require('request');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var api_secret = process.env.API_SECRET || '1a2a450cb29bcc2bd3a6cba8729c77c2d90d5dc6';
var api_url = process.env.API_URL || 'http://testnet2.hoste.ro:9000';

var wallets = [{
  "version": "0.1",
  "address": "WEBD$gCD4CFYTjWqXDiQ3s7zz@G0b#DwDjh5udb$",
  "publicKey": "f4692fa1a66995984f7c5ef1f9d08a83535986e82b786054cf92e94c5a3aea8b",
  "privateKey": "800163f94970607effb636a3cdc494d616b1c912f2b0a4594cbdc379002ffa439cf4692fa1a66995984f7c5ef1f9d08a83535986e82b786054cf92e94c5a3aea8b120dc907"
}];

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
