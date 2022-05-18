
**[TinyWallet](https://tinywallet.app)** - self-hosted programmable crypto wallet.

## UseCase


* **Coin Shop** - exchange between coins and currency
* **NFT Shop** - excustomized nft shop
* **Transation Approve** - role-based management, seperate view, submit, approve roles
* **Assert Audit** - tokens, nfts transactions audit by tags, users

## Api-First Design

* **create or import wallet** `/api/wallet`
* **new api account** `/api/wallet/:address/account`
* **submit transation** `/api/wallet/:address/transation`
* [more...](views/doc/api.md)

## how to self-hosted

1. `cp .env.default .env`
2. `vi .env`
3. `npm install`
4. `pm2 start`

