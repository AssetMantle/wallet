export const DefaultChainInfo = {
    counterpartyChainId: 'core-1',
    chainName:'Persistence',
    currency: {
        coinDenom: 'XPRT',
        coinMinimalDenom: 'uxprt',
        coinDecimals: 6,
        coinGeckoId: 'persistence',
    },
    coinType: 750,
};

export const PstakeInfo = {
    coinDenom: 'PSTAKE',
    coinMinimalDenom: 'ibc/A6E3AF63B3C906416A9AF7A556C59EA4BD50E617EFFE6299B99700CCB780E444',
    baseDenom: 'gravity0xfB5c6815cA3AC72Ce9F5006869AE67f18bF77006',
    coinDecimals: 18,
};

export const GasInfo ={
    gas: 250000,
    minGas: 80000,
    maxGas : 2000000,
};

export const FeeInfo ={
    lowFee: 0,
    averageFee: 0.025,
    highFee: 0.04,
    defaultFee: "5000",
    vestingAccountFee: "0",
};

export const IBCConfiguration = {
    timeoutTimestamp: 1000,
    ibcRevisionHeightIncrement: 1000,
    ibcRemoteHeightIncrement: 150,
    ibcDefaultPort: "transfer",
};

export const IBCChainInfos = [
    {
        counterpartyChainId: 'osmosis-1',
        chainName:'Osmosis',
        sourceChannelId: 'channel-6',
        portID:'transfer',
        coinMinimalDenom: 'uatom',
    },
    {
        counterpartyChainId: 'cosmoshub-4',
        chainName:'Cosmos',
        sourceChannelId: 'channel-24',
        portID:'transfer',
        coinMinimalDenom: 'uatom',
    },
    {
        counterpartyChainId: 'juno-1',
        chainName:'Juno',
        sourceChannelId: 'channel-42',
        portID:'transfer',
        coinMinimalDenom: 'ujuno',
    },
    {
        counterpartyChainId: 'gravity-bridge-3',
        chainName:'Gravity',
        sourceChannelId: 'channel-38',
        portID:'transfer',
        coinMinimalDenom: 'ugraviton',
    },
];

export const ExternalChains = [
    {
        rpc: 'https://rpc.osmosis-1.audit.one/',
        rest: 'https://rest.osmosis-1.audit.one/',
        chainId: 'osmosis-1',
        chainName: 'Osmosis',
        portID: 'transfer',
        currency: {
            coinDenom: 'OSMO',
            coinMinimalDenom: 'uosmo',
            coinDecimals: 6,
            coinGeckoId: 'osmosis',
        },
        coinType: 118,
    },
    {
        rpc: 'https://rpc.cosmoshub-4.audit.one/',
        rest: 'https://rest.cosmoshub-4.audit.one/',
        chainId: 'cosmoshub-4',
        chainName: 'Cosmos',
        currency: {
            coinDenom: 'COSMOS',
            coinMinimalDenom: 'uatom',
            coinDecimals: 6,
            coinGeckoId: 'cosmos',
        },
        coinType: 118,
    },
    {
        rpc: 'https://api.gravity.audit.one/rpc/',
        rest: 'https://api.gravity.audit.one/lcd/',
        chainId: 'cosmoshub-4',
        chainName: 'Cosmos',
        currency: {
            coinDenom: 'GRAV',
            coinMinimalDenom: 'ugraviton',
            coinDecimals: 6,
            coinGeckoId: '',
        },
        coinType: 118,
    },
];
