import { combineReducers } from 'redux';
import delegations from './delegations';
import transactions from "./transactions"
export default combineReducers({
    delegations,
    transactions,
});
