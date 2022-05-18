

## Wallet

### create wallet

`post /api/wallet`

```
id: "",
mail: "",
pwd: "",
privateKey: ""
```

### create wallet api account
`post /api/wallet/:address/account`

```
id:"",
pwd: "",
account: "",
role: ""
```

## Asset

### get wallet asset list
`get /api/wallet/:address/assets`

### get wallet asset detail
`get /api/wallet/:address/asset/:symbolOrAddress`


## Transation

### get transation list
`get /api/wallet/:address/transations`

### send transation
`post /api/wallet/:address/transation`
