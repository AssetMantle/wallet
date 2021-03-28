import { combineReducers } from 'redux';
import delegations from './delegations';
import transactions from "./transactions";
import validators from "./validators";
import balance from "./balance";
import rewards from "./rewards";
import unbond from "./unbond";
import authentication from "./authentication";
export default combineReducers({
    delegations,
    transactions,
    validators,
    balance,
    rewards,
    unbond,
    authentication,
});
