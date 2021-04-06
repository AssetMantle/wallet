import {combineReducers} from 'redux';
import {
    DELEGATIONS_FETCH_ERROR,
    DELEGATIONS_FETCH_SUCCESS,
    DELEGATIONS_STATUS_SUCCESS
} from "../constants/delegations";

const count = (state = 0, action) => {
    if (action.type === DELEGATIONS_FETCH_SUCCESS) {
        return (action.count * 1);
    }
    return state;
};

const status = (state = false, action) => {
    if (action.type === DELEGATIONS_STATUS_SUCCESS) {
        return (action.value);
    }
    return state;
};

const _ = (state = 0, action) => {
    if (action.type === DELEGATIONS_FETCH_SUCCESS) {
        return (action.count * 1);
    } else {
        return state;
    }
};


export default combineReducers({
    count,
    _,
    status,
});