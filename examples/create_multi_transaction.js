var _ = require('underscore');
var request = require('request');

var TRANSACTION_FEE = 400;
var WEBD_MULTIPLIER = 10000;
var FROM_ADDRESS = 'WEBD$gBi9wMDg87wh0DXa5Nkjy7uCmHKQAdj28b$';
var API_KEY = 'xxxx';
var URL = 'http://node.webdollar.io/' + API_KEY;

var addresses = [
  'WEBD$gBi9wMDg87wh0DXa5Nkjy7uCmHKQAdj28b$',
  'WEBD$gBvcPwkUM6jcsQm5B$#49BBoYXJ4c2Scyj$',
  'WEBD$gArmaBqMXbwGs#uGxVqjMKgwPAE67IJR6f$',
];

addresses = _.uniq(addresses);

var total_sum = 0;
var to_addresses = [];
var transfer_url = URL + '/wallets/create-transaction/' + encodeURIComponent(FROM_ADDRESS) + '/null/null/' + TRANSACTION_FEE;

for (var i = 0; i < addresses.length; i++) {
  var address = addresses[i];
  var sum = 1500;

  if (!address.match(/WEBD\$[a-km-zA-NP-Z0-9+@#$]{34}\$/)) {
    console.log('address', address, 'failed test');

    continue;
  }

  to_addresses.push({
    address: address,
    amount: sum * WEBD_MULTIPLIER,
  });

  total_sum += sum;
}

console.log('total addresses', to_addresses.length);
console.log('total reward', total_sum);

request.post(
  {
    url: transfer_url,
    body: {
      multiple_to: to_addresses,
    },
    json: true,
  },
  function (err, message, body) {
    if (err) {
      console.error(err);
    }

    console.log(body);
  }
);
