# pull the base image
FROM node:14

WORKDIR /usr/src/app

# REACT_APP_PROXY_API is required for fetching coin price
ARG PROXY_API
ENV REACT_APP_PROXY_API=${PROXY_API}
# REACT_APP_CHAIN_ID is the blockchain chain-id, can be found in rpc endpoint under /status -> network, adding test-net configurations.
ARG REACT_APP_CHAIN_ID
ENV REACT_APP_CHAIN_ID=${REACT_APP_CHAIN_ID}
# REACT_APP_CHAIN_NAME required to display chain name on the app
ARG REACT_APP_CHAIN_NAME
ENV REACT_APP_CHAIN_NAME=${REACT_APP_CHAIN_NAME}
# REACT_APP_WEBSITE_URL deployed website url
ARG REACT_APP_WEBSITE_URL
ENV REACT_APP_WEBSITE_URL=${REACT_APP_WEBSITE_URL}
# REACT_APP_API_KEY is the blockchain rest endpoint, default ~ ip:1317
ARG REACT_APP_API_KEY
ENV REACT_APP_API_KEY=${REACT_APP_API_KEY}
# REACT_APP_TENDERMINT_RPC_ENDPOINT is the tendermint rpc endoiunt, default ~ ip:26657
ARG REACT_APP_TENDERMINT_RPC_ENDPOINT
ENV REACT_APP_TENDERMINT_RPC_ENDPOINT=${REACT_APP_TENDERMINT_RPC_ENDPOINT}
# REACT_APP_EXPLORER_API is endpoint for explorer, requried for redirecting txHash
ARG REACT_APP_EXPLORER_API
ENV REACT_APP_EXPLORER_API=${REACT_APP_EXPLORER_API}

# install app dependencies
COPY package.json ./

COPY package-lock.json ./

RUN npm cache clean --force

RUN npm ci --production

# add app
COPY . /usr/src/app

# start app
CMD ["npm", "start"]