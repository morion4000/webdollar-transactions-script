var request = require('request');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var api_secret = process.env.API_SECRET || '1a2a450cb29bcc2bd3a6cba8729c77c2d90d5dc6';
var api_url = process.env.API_URL || 'http://testnet5.hoste.ro:43001';

var transaction_fee = process.env.FEE || 10;

var to_addresses = process.env.TO_ADDRESSES ? JSON.parse(process.env.TO_ADDRESSES) : [{
  address: 'WEBD$gBq40vEAH4rh2f1Imxft4G9A4H9cYf954z$',
  amount: 10000
}, {
  address: 'WEBD$gA0wAI2f208tTDmzUE5cJfd+ACUB@aGszb$',
  amount: 10000
}];

console.log('sending to', to_addresses.length);

var wallet = process.env.WALLET ? JSON.parse(process.env.WALLET) : {
  "version": "0.1",
  "address": "WEBD$gDSRHzxo4hSnsxDxZ3q5maccGLgyMeH9fz$",
  "publicKey": "daf3beeb5240a1bbae1247099ccb3b4c4d0b1b3b27c422b64e8d9aebf0d9eee1",
  "privateKey": "809f0528e6ff08d71b8ef931630ff030dd80a65fbbde5d39c2fe854d98fe5e854edaf3beeb5240a1bbae1247099ccb3b4c4d0b1b3b27c422b64e8d9aebf0d9eee1896f1cba"
};

var transfer_url = api_url + '/' + api_secret + '/wallets/create-transaction/' + encodeURIComponent(wallet.address) + '/null/null/' + transaction_fee;

request.post({
  url: transfer_url,
  body: {
    multiple_to: to_addresses
  },
  json: true
}, function(err, message, body) {
  if (err) {
    console.error(err);
  }

  console.log(body);
});
