# webdollar-transactions-script
Nodejs script for programmatic WebDollar transactions (Experimental). The scripts are making HTTP requests to full nodes in order to push transactions in the WebDollar network.

**Important**: Full nodes have to be started with the `WALLET_SECRET_URL` environment variable (set to at least 30 characters). The private API is not going to be accessible otherwise.

# Workflow

The wallet from which transactions are sent must first be imported on the full node. After the wallet is imported, funds can be sent from the wallet.

**IMPORT_WALLET** -> **CREATE_TRANSACTION**

**Notice**: It is recommended to wait a few seconds between API calls.

# API Endpoints

The scripts rely on WebDollar's private API endpoints.:
- import_wallet
- create_transaction

### Global parameters:
- `API_URL`: The url of the deployed full node (port included), _example: https://wd.hoste.ro:40000_
- `WALLET_SECRET_URL`: The 30 characters string set to the `WALLET_SECRET_URL` environment variable, _example: 7f55a0ed8b021080de00960cc73768fb_

## Import a wallet
 `API_URL`/`WALLET_SECRET_URL`/wallets/import/`ADDRESS`/`PUBLIC_KEY`/`PRIVATE_KEY`

Example: https://wd.hoste.ro:40000/7f55a0ed8b021080de00960cc73768fb/wallets/import/WEBD$gD1Km74GiVeTX3NqeY31iJ49FfdCAFCB0P$/063373759855cd4ac52fae078e9f36dfdba420191beb9e3a1dbc5b7205e66292/80cd858e76bd2b253b634d71bd2c8ea97314154020f63ab4baf2e4d605630529c7063373759855cd4ac52fae078e9f36dfdba420191beb9e3a1dbc5b7205e66292e8d1ce62

#### Parameters:

They can be found in the exported wallet file.

`{ "version":"0.1",
  "address":"WEBD$gD1Km74GiVeTX3NqeY31iJ49FfdCAFCB0P$",
  "publicKey":"063373759855cd4ac52fae078e9f36dfdba420191beb9e3a1dbc5b7205e66292",
  "privateKey":"80cd858e76bd2b253b634d71bd2c8ea97314154020f63ab4baf2e4d605630529c7063373759855cd4ac52fae078e9f36dfdba420191beb9e3a1dbc5b7205e66292e8d1ce62" }`

- `ADDRESS`: The wallet's public address (might have to be encoded)
- `PUBLIC_KEY`: The wallet's public key
- `PRIVATE_KEY`: The wallet's private key

## Create a transaction
 `API_URL`/`WALLET_SECRET_URL`/wallets/create-transaction/`FROM_ADDRESS`/`TO_ADDRESS`/`AMOUNT`/`FEE`

Example: https://wd.hoste.ro:40000/7f55a0ed8b021080de00960cc73768fb/wallets/create-transaction/WEBD$gD1Km74GiVeTX3NqeY31iJ49FfdCAFCB0P$/WEBD$gD1Km74GiVeTX3NqeY31iJ49FfdCAFCB0P$/1/1

#### Parameters:

- `FROM_ADDRESS`: The WEBD address to send the funds from (must be imported first, might have to be encoded)
- `TO_ADDRESS`: The WEBD address to send the funds to (might have to be encoded)
- `AMOUNT`: Number expressed in WEBD
- `FEE`: Number expressed in WEBD


# Disclaimer
The methods described are experimental and although they work, they are be vulnerable to attacks. No security practices have been implemented.
