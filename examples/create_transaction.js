var request = require('request');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var api_secret = process.env.API_SECRET || '1a2a450cb29bcc2bd3a6cba8729c77c2d90d5dc6';
var api_url = process.env.API_URL || 'http://testnet2.hoste.ro:9000';

var transaction_fee = process.env.FEE || 10;
var transaction_limit = 10;
var transactions = 0;
var amount = process.env.AMOUNT || 11;

var to_addresses = [
  'WEBD$gA0wAI2f208tTDmzUE5cJfd+ACUB@aGszb$',
];

console.log('sending to', to_addresses.length);

var wallet = {
  "version": "0.1",
  "address": "WEBD$gCD4CFYTjWqXDiQ3s7zz@G0b#DwDjh5udb$",
  "publicKey": "f4692fa1a66995984f7c5ef1f9d08a83535986e82b786054cf92e94c5a3aea8b",
  "privateKey": "800163f94970607effb636a3cdc494d616b1c912f2b0a4594cbdc379002ffa439cf4692fa1a66995984f7c5ef1f9d08a83535986e82b786054cf92e94c5a3aea8b120dc907"
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
