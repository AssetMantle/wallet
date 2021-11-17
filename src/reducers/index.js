import {combineReducers} from 'redux';
import delegations from './delegations';
import transactions from "./transactions";
import validators from "./validators";
import balance from "./balance";
import rewards from "./rewards";
import unbond from "./unbond";
import tokenPrice from "./tokenPrice";
import withdrawAddress from "./withdrawAddress";
import common from "./transactions/common";
import send from "./transactions/send";
import fee from "./transactions/fee";
import gas from "./transactions/gas";
import keyStore from "./transactions/keyStore";
import advanced from "./transactions/advanced";
export default combineReducers({
    delegations,
    transactions,
    validators,
    balance,
    rewards,
    unbond,
    tokenPrice,
    send,
    withdrawAddress,
    common,
    fee,
    gas,
    keyStore,
    advanced
});
