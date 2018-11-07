var request = require('request');
var _ = require('underscore');

var miners_url = 'https://server.webdollarminingpool.com/pools/miners';
var explorer_url = 'https://webdollar.network:5001/address/';
//var explorer_url = 'http://178.79.174.109:3000/address/';
var explorer_suffix = '?show_all_transactions=true';
var pool_address = 'WEBD$gCrEhDsa9Wv$@x3QkNd4jbNcb5bISk8Nyv$';
var data = {};
var total = 0;

request.get(miners_url, function(err, message, body) {
  var data = JSON.parse(body);

  var grouped = _.groupBy(data, 'address');
  var count = 0;

  _.each(grouped, function(group, address) {
    var reward_sent = parseInt(group[0].reward_sent / 10000);
    var url = explorer_url + address + explorer_suffix;

    count++;
    //if (count > 15) return;

    setTimeout((function(_url, _address, _reward_sent, _count) {
      return function() {
        request.get(_url, function(err, message, body) {
          var address_data = {};
          var sent = 0;

          try {
            address_data = JSON.parse(body);
          } catch (e) {
            console.error(body);
            return;
          }

          _.each(address_data.transactions, function(transaction) {
            if (transaction.from.address[0] !== pool_address) return;
            sent += parseInt(transaction.from.amount);
          });

          data[_address] = sent;
          var delta = _reward_sent - sent;

          if (delta > 0) {
            total += delta;

            console.log(_count, _address, delta, total);
          }
        });
      };
    })(url, address, reward_sent, count), 5000 * count);
  });

  console.log('found', count, 'addresses');
});
