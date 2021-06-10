import {combineReducers} from 'redux';
import {
    REWARDS_FETCH_ERROR,
    REWARDS_FETCH_IN_PROGRESS,
    REWARDS_FETCH_SUCCESS,
    REWARDS_LIST_FETCH_SUCCESS
} from "../constants/rewards";

const inProgress = (state = false, action) => {
    switch (action.type) {
    case REWARDS_FETCH_IN_PROGRESS:
        return true;
    case REWARDS_FETCH_SUCCESS:
    case REWARDS_FETCH_ERROR:
        return false;
    default:
        return state;
    }
};

const list = (state = [], action) => {
    if (action.type === REWARDS_LIST_FETCH_SUCCESS) {
        return action.list;
    }
    return state;
};


const rewards = (state = 0, action) => {
    if (action.type === REWARDS_FETCH_SUCCESS) {
        return action.data;
    }
    return state;
};

const _ = (state = 0, action) => {
    if (action.type === REWARDS_FETCH_ERROR) {
        return action.data;
    } else {
        return state;
    }
};


export default combineReducers({
    rewards,
    list,
    _,
    inProgress
});
