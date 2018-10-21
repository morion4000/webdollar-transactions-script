var request = require('request');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var api_secret = process.env.API_SECRET || '1a2a450cb29bcc2bd3a6cba8729c77c2d90d5dc6';
var api_url = process.env.API_URL || 'http://testnet5.hoste.ro:43001';

var transaction_fee = process.env.FEE || 10;
var transaction_limit = 10;
var transactions = 0;
var amount = process.env.AMOUNT || 20;

var to_addresses = [
  process.env.TO_ADDRESS_1 || 'WEBD$gA0wAI2f208tTDmzUE5cJfd+ACUB@aGszb$',
];

console.log('sending to', to_addresses.length);
/*
var wallet = {
  "version": "0.1",
  "address": "WEBD$gCD4CFYTjWqXDiQ3s7zz@G0b#DwDjh5udb$",
  "publicKey": "f4692fa1a66995984f7c5ef1f9d08a83535986e82b786054cf92e94c5a3aea8b",
  "privateKey": "800163f94970607effb636a3cdc494d616b1c912f2b0a4594cbdc379002ffa439cf4692fa1a66995984f7c5ef1f9d08a83535986e82b786054cf92e94c5a3aea8b120dc907"
};
*/

var wallet = process.env.WALLET ? JSON.parse(process.env.WALLET) : {
  "version": "0.1",
  "address": "WEBD$gDSRHzxo4hSnsxDxZ3q5maccGLgyMeH9fz$",
  "publicKey": "daf3beeb5240a1bbae1247099ccb3b4c4d0b1b3b27c422b64e8d9aebf0d9eee1",
  "privateKey": "809f0528e6ff08d71b8ef931630ff030dd80a65fbbde5d39c2fe854d98fe5e854edaf3beeb5240a1bbae1247099ccb3b4c4d0b1b3b27c422b64e8d9aebf0d9eee1896f1cba"
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
