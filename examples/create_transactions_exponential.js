var request = require('request');
var async = require('async');
var _ = require('underscore');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var api_secret = process.env.API_SECRET || '1a2a450cb29bcc2bd3a6cba8729c77c2d90d5dc6';
var api_url = process.env.API_URL || 'http://testnet2.hoste.ro:8001';
var transaction_fee = process.env.FEE || 10;
var amount = process.env.AMOUNT || 20;
var wallet = process.env.WALLET ? JSON.parse(process.env.WALLET) : {
  "version": "0.1",
  "address": "WEBD$gAYakKoZDM7zNk+SRsD4+HhEU3MdEEd88r$",
  "publicKey": "b2196351c9e7b17360151bc4121ac8aeb793abb905d0fb8618cc016b32175316",
  "privateKey": "808184d9d8d339260e3e4826bd8717f708e118c0122c543d8937285d07a45c9674b2196351c9e7b17360151bc4121ac8aeb793abb905d0fb8618cc016b321753167d182698"
};

loop([wallet.address]);

function loop(wallets) {
  var transactions = [];
  var new_wallets = [];

  async.each(wallets, function(wallet, callback) {
    async.series([
      create_wallet,
      create_wallet
    ], function(err, res) {
      if (err) {
        return callback(err);
      }

      console.log('created wallet', res[0].address);
      console.log('created wallet', res[1].address);

      new_wallets.push(wallet.address);

      transactions.push({
        from: wallet,
        to: res[0].address
      });

      transactions.push({
        from: wallet,
        to: res[1].address
      });

      setTimeout(callback, 2000); // wait for the wallets to be created properly
    });
  }, function(err) {
    if (err) {
      console.error('wallets create', err);
      return;
    }

    // All new wallets have been created, create transactions
    async.each(transactions, function(transaction, callback) {
      get_wallet_balance(transaction.from, function(balance) {
        // 2 transactions will be made from each wallet
        var amount = (balance - transaction_fee - 100) / 2;

        console.log('sending', amount, 'WEBD');

        create_transaction_and_wait(transaction.from, transaction.to, amount, callback);
      });
    }, function(err) {
      if (err) {
        console.error('transactions iteration', err);
        return;
      }

      // All new transactions have been created and mined
      loop(new_wallets);
    });
  });
}

function create_wallet(callback) {
  var create_wallet_url = api_url + '/' + api_secret + '/wallets/create-wallet';

  request.get(create_wallet_url, function(err, message, body) {
    if (err) {
      console.error('wallet create', err);
      return callback(err);
    }

    var _wallet;

    console.log(create_wallet_url);

    try {
      _wallet = JSON.parse(body);
    } catch (e) {
      console.error('wallet parsing', e);
      return callback(e);
    }

    callback(null, _wallet.wallet);
  });
}

function create_transaction_and_wait(from, to, amount, callback) {
  var transfer_url = api_url + '/' + api_secret + '/wallets/create-transaction/' + encodeURIComponent(from) + '/' + encodeURIComponent(to) + '/' + amount + '/' + transaction_fee;

  request.get(transfer_url, function(err, message, body) {
    if (err) {
      console.error('create transaction', err);
      return callback(err);
    }

    console.log('transaction created', from, to);

    // Check for ~5 minutes to make sure transaction was mined
    async.retry({
      times: 50,
      interval: 5000
    }, function(_callback) {
      get_wallet_balance(to, function(balance) {
        if (balance > 0) {
          console.log('transaction mined', from, to);

          _callback();
        } else {
          console.log('transaction was not mined ' + from + ' ' + to);

          _callback('transaction was not mined in time ' + from + ' ' + to);
        }
      });
    }, callback);
  });
}

function get_wallet_balance(wallet, callback) {
  var balance_url = api_url + '/address/balance/' + encodeURIComponent(wallet);

  request.get(balance_url, function(err, message, body) {
    var data;

    try {
      data = JSON.parse(body);
    } catch (e) {
      console.error('balance parse', e);
      data = {
        balance: 0
      };
    }

    callback(data.balance);
  });
}
