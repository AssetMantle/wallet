import {combineReducers} from 'redux';
import {DELEGATIONS_FETCH_SUCCESS, DELEGATIONS_STATUS_SUCCESS} from "../../constants/delegations";
import helper from "../../utils/helper";

const count = (state = 0, action) => {
    if (action.type === DELEGATIONS_FETCH_SUCCESS) {
        return (helper.stringToNumber(action.count));
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
        return (helper.stringToNumber(action.count));
    } else {
        return state;
    }
};


export default combineReducers({
    count,
    _,
    status,
});