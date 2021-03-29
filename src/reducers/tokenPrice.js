import { combineReducers } from 'redux';
import {
    TOKEN_PRICE_FETCH_SUCCESS,
    TOKEN_PRICE_FETCH_ERROR,
} from "../constants/tokenPrice"



const tokenPrice = (state = {}, action) => {
    if (action.type === TOKEN_PRICE_FETCH_SUCCESS) {
        return action.data;
    }
    return state;
};

const _ = (state = {}, action) => {
    if (action.type === TOKEN_PRICE_FETCH_ERROR) {
        return action.data;
    } else {
        return state;
    }
};


export default combineReducers({
    tokenPrice,
    _,
});