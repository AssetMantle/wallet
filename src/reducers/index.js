import { combineReducers } from 'redux';
import delegations from './delegations';
import transactions from "./transactions";
import validators from "./validators";
import balance from "./balance";
import rewards from "./rewards";
import unbond from "./unbond";
import tokenPrice from "./tokenPrice";
import withdrawAddress from "./withdrawAddress";
export default combineReducers({
    delegations,
    transactions,
    validators,
    balance,
    rewards,
    unbond,
    tokenPrice,
    withdrawAddress
});
