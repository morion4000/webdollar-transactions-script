var request = require('request');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var api_secret = '7f55a0ed8b021080de00960cc73768fb';
var api_url = 'https://wd.hoste.ro:40000';

var wallets = [{
  "version": "0.1",
  "address": "WEBD$gD1Km74GiVeTX3NqeY31iJ49FfdCAFCB0P$",
  "publicKey": "063373759855cd4ac52fae078e9f36dfdba420191beb9e3a1dbc5b7205e66292",
  "privateKey": "80cd858e76bd2b253b634d71bd2c8ea97314154020f63ab4baf2e4d605630529c7063373759855cd4ac52fae078e9f36dfdba420191beb9e3a1dbc5b7205e66292e8d1ce62"
}];

wallet.forEach(function(w, i) {
  var encoded_address = encodeURIComponent(w.address);
  var balance_url = api_url + '/address/balance/' + encoded_address;
  var import_url = api_url + '/' + api_secret + '/wallets/import/' + w.address + '/' + w.publicKey + '/' + w.privateKey;

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
