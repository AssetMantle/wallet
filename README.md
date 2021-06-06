# Persistence Wallet
This is the main repository Persistence Wallet, React + Javascript project.

## Deployments
Tagged Releases are deployed on [wallet.persistence.one](https://wallet.persistence.one) which connects to Peristence Core mainnet.   
Latest main branch codebase is deployed on [staging.wallet.persistence.one](https://staging.wallet.persistence.one) which connects to Persistence Core testnet.
Any requests for test-tokens, questions, suggestions, are welcome on [Discord Persistence -> under wallet-development](https://discord.gg/s8hBStXjKs)

## Libraries and Integrations   
- [cosmos/cosmjs](https://github.com/cosmos/cosmjs)
- [cosmostation/cosmosjs](https://github.com/cosmostation/cosmosjs)
- [keplr experimental feature](https://github.com/chainapsis/keplr-example)
## Developer Configurations
```
npm: '7.14.0'
node: '16.1.0'
```

.env 
```
# REACT_APP_MAIL_CHIMP_URL is required for mail subscription ~ not required for local development
REACT_APP_MAIL_CHIMP_URL=
# REACT_APP_PROXY_API is required for fetching coin price
REACT_APP_PROXY_API=
# REACT_APP_CHAIN_ID is the blockchain chain-id, can be found in rpc endpoint under /status -> network, adding test-net configurations.
REACT_APP_CHAIN_ID=test-core-1
# REACT_APP_CHAIN_NAME required to display chain name on the app
REACT_APP_CHAIN_NAME="Persistence Test-Core"
# REACT_APP_WEBSITE_URL deployed website url
REACT_APP_WEBSITE_URL=http://localhost:3000
# REACT_APP_API_KEY is the blockchain rest endpoint, default ~ ip:1317
REACT_APP_API_KEY=https://persistence.testnet.rest.audit.one
# REACT_APP_TENDERMINT_RPC_ENDPOINT is the tendermint rpc endoiunt, default ~ ip:26657
REACT_APP_TENDERMINT_RPC_ENDPOINT=https://persistence.testnet.rpc.audit.one
# REACT_APP_EXPLORER_API is endpoint for explorer, requried for redirecting txHash
REACT_APP_EXPLORER_API=https://test-core-1.explorer.persistence.one
```
Requires Blockchain Rest Client CORS and RPC client CORS (under `.persistenceCore/config/app.toml`) to be disabled/ configured accordingly.
