import { combineReducers } from 'redux';
import {
    DELEGATIONS_FETCH_ERROR,
    DELEGATIONS_FETCH_SUCCESS
} from "../constants/delegations";

const count = (state = 0, action) => {
    if (action.type === DELEGATIONS_FETCH_SUCCESS) {
        return action.count;
    }
    return state;
};

const _ = (state = 0, action) => {
    if (action.type === DELEGATIONS_FETCH_SUCCESS) {
        return action.count;
    } else {
        return state;
    }
};


export default combineReducers({
    count,
    _,
});