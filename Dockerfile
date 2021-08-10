# pull the base image
FROM node:16

WORKDIR /usr/src/app

# REACT_APP_PROXY_API is required for fetching coin price
ENV REACT_APP_PROXY_API=""
# REACT_APP_CHAIN_ID is the blockchain chain-id, can be found in rpc endpoint under /status -> network, adding test-net configurations.
ENV REACT_APP_CHAIN_ID=test-core-1
# REACT_APP_CHAIN_NAME required to display chain name on the app
ENV REACT_APP_CHAIN_NAME="Persistence Test-Core"
# REACT_APP_WEBSITE_URL deployed website url
ENV REACT_APP_WEBSITE_URL=http://localhost:3000
# REACT_APP_API_KEY is the blockchain rest endpoint, default ~ ip:1317
ENV REACT_APP_API_KEY=https://persistence.testnet.rest.audit.one
# REACT_APP_TENDERMINT_RPC_ENDPOINT is the tendermint rpc endoiunt, default ~ ip:26657
ENV REACT_APP_TENDERMINT_RPC_ENDPOINT=https://persistence.testnet.rpc.audit.one
# REACT_APP_EXPLORER_API is endpoint for explorer, requried for redirecting txHash
ENV REACT_APP_EXPLORER_API=https://test-core-1.explorer.persistence.one

# install app dependencies
COPY package.json ./

COPY package-lock.json ./

RUN npm cache clean --force

RUN npm ci --production

# add app
COPY . /usr/src/app

# start app
CMD ["npm", "start"]