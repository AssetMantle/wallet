const API_URL = process.env.REACT_APP_API_KEY;
const RPC_URL = process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;
export const getRewardsUrl = (address) => `${API_URL}/cosmos/distribution/v1beta1/delegators/${address}/rewards`;
export const getDelegationsUnbondUrl = (address) => `${API_URL}/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`;
export const getDelegationsUrl = (address) => `${API_URL}/cosmos/staking/v1beta1/delegations/${address}`;
export const getValidatorsUrl = () => `${API_URL}/cosmos/staking/v1beta1/validators`;
export const getValidatorUrl = (address) => `${API_URL}/cosmos/staking/v1beta1/validators/${address}`;
export const getBalanceUrl = (address) => `${API_URL}/cosmos/bank/v1beta1/balances/${address}`;
export const getTxnUrl = (hash) => `${API_URL}/cosmos/tx/v1beta1/txs/${hash}`;

export const getSendTransactionsUrl = (address, limit, pageNumber) => `${API_URL}/cosmos/tx/v1beta1/txs?events=message.sender='${address}'&order_by=ORDER_BY_DESC&pagination.offset=${limit * pageNumber}&pagination.limit=${limit}&pagination.count_total=true`;
export const getReceiveTransactionsUrl = (address, limit, pageNumber) => `${API_URL}/cosmos/tx/v1beta1/txs?events=transfer.recipient='${address}'&order_by=ORDER_BY_DESC&pagination.offset=${limit * pageNumber}&pagination.limit=${limit}&pagination.count_total=true`;
export const getValidatorRewardsUrl = (address, validatorAddress) => `${API_URL}/cosmos/distribution/v1beta1/delegators/${address}/rewards/${validatorAddress}`;
export const getAccountUrl = (address) => `${API_URL}/cosmos/auth/v1beta1/accounts/${address}`;
export const getWithdrawAddressUrl = (address) => `${API_URL}/cosmos/distribution/v1beta1/delegators/${address}/withdraw_address`;
export const getLatestBlockUrl = () => `${RPC_URL}/block`;

