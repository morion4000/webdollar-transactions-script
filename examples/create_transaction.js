var request = require('request');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var api_secret = '7f55a0ed8b021080de00960cc73768fb';
var api_url = 'https://wd.hoste.ro:40000';

var transaction_fee = 1;
var transaction_limit = 10;
var transactions = 0;
var amount = 1000;

var to_addresses = [
  'WEBD$gD1Km74GiVeTX3NqeY31iJ49FfdCAFCB0P$',
];

console.log('sending to', to_addresses.length);

var wallet = {
  "version": "0.1",
  "address": "WEBD$gD1Km74GiVeTX3NqeY31iJ49FfdCAFCB0P$",
  "publicKey": "063373759855cd4ac52fae078e9f36dfdba420191beb9e3a1dbc5b7205e66292",
  "privateKey": "80cd858e76bd2b253b634d71bd2c8ea97314154020f63ab4baf2e4d605630529c7063373759855cd4ac52fae078e9f36dfdba420191beb9e3a1dbc5b7205e66292e8d1ce62"
};

to_addresses.forEach(function(w, i) {
  var amount_to_send = amount - transaction_fee;
  var transfer_url = api_url + '/' + api_secret + '/wallets/create-transaction/' + encodeURIComponent(wallet.address) + '/' + encodeURIComponent(w) + '/' + amount_to_send + '/' + transaction_fee;

  // Wait 5 seconds between transaction calls
  setTimeout(function() {
    // Limit number of transactions
    if (transactions > transaction_limit) return;

    transactions++;

    request.get(transfer_url, function(err, message, body) {
      if (err) {
        console.error(err);
      }

      console.log(transfer_url);
    });
  }, i * 5000);
});
