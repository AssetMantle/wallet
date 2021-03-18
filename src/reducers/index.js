import { combineReducers } from 'redux';
import Delegations from "./Delegations"
import delegate from "./transactions/delegate";
const root = combineReducers({
    Delegations,
    delegate
});

export default root;
