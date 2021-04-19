# tap-liquidity-mining-ui

Based on https://github.com/Uniswap/uniswap-interface

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

ENV for production should look like:

```
REACT_APP_CHAIN_ID="1"
REACT_APP_NETWORK_URL="YOUR KEY"
REACT_APP_PORTIS_ID="YOUR KEY"
REACT_APP_FORTMATIC_KEY="YOUR KEY"
```

Note that the interface only works on testnets where both 
[Uniswap V2](https://uniswap.org/docs/v2/smart-contracts/factory/) and 
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.