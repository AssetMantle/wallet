import {
    DELEGATIONS_GET_SUCCESS,
    DELEGATIONS_GET_ERROR,
} from '../constants/Delegations';
import { combineReducers } from 'redux';

const items = (state = [], {
    type,
    data,
}) => {
    console.log(data," DELEGATIONS_GET_SUCCESSRaju")
    if (type === DELEGATIONS_GET_SUCCESS) {
        return data;
    } else {
        return state;
    }
};

const inProgress = (state = false, {
    type,
}) => {
    switch (type) {
        case DELEGATIONS_GET_SUCCESS:
        case DELEGATIONS_GET_ERROR:
            return false;
        default:
            return state;
    }
};

export default combineReducers({
    items,
    inProgress,
});
