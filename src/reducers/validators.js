import {combineReducers} from 'redux';
import {
    FETCH_ACTIVE_VALIDATORS_SUCCESS,
    FETCH_VALIDATORS_ERROR,
    FETCH_INACTIVE_VALIDATORS_SUCCESS,
    FETCH_VALIDATORS_IN_PROGRESS,
    FETCH_VALIDATORS_SUCCESS,
    FETCH_VALIDATOR_WITH_ADDRESS_SUCCESS,
    FETCH_VALIDATORS_REWARDS_SUCCESS,
    FETCH_VALIDATORS_REWARDS_IN_PROGRESS,
    FETCH_VALIDATOR_COMMISSION_INFO_SUCCESS
} from "../constants/validators";
import Lodash from "lodash";

const inProgress = (state = false, action) => {
    switch (action.type) {
    case FETCH_VALIDATORS_IN_PROGRESS:
        return true;
    case FETCH_ACTIVE_VALIDATORS_SUCCESS:
    case FETCH_INACTIVE_VALIDATORS_SUCCESS:
    case FETCH_VALIDATORS_SUCCESS:
    case FETCH_VALIDATORS_ERROR:
        return false;
    default:
        return state;
    }
};

const rewardsInProgress =  (state = false, action) => {
    switch (action.type) {
    case FETCH_VALIDATORS_REWARDS_IN_PROGRESS:
        return true;
    case FETCH_VALIDATOR_WITH_ADDRESS_SUCCESS:
    case FETCH_VALIDATORS_REWARDS_SUCCESS:
        return false;
    default:
        return state;
    }
};

const activeList = (state = [], action) => {
    if (action.type === FETCH_ACTIVE_VALIDATORS_SUCCESS) {
        return action.list;
    }
    return state;
};

const activeVotingPower = (state = 0, action) => {

    if (action.type === FETCH_ACTIVE_VALIDATORS_SUCCESS) {
        const active = Lodash.sumBy(action.list, (item) => {
            return parseInt(item.tokens);
        });

        return {
            ...state,
            active,
        };
    }
    return state;
};

const inActiveVotingPower = (state = 0, action) => {
    if (action.type === FETCH_INACTIVE_VALIDATORS_SUCCESS) {
        const inActive = Lodash.sumBy(action.list, (item) => {
            return parseInt(item.tokens);
        });
        return {
            ...state,
            inActive,
        };
    }
    return state;
};

const inActiveList = (state = [], action) => {
    if (action.type === FETCH_INACTIVE_VALIDATORS_SUCCESS) {
        return action.list;
    } else {
        return state;
    }
};
const validators = (state = [], action) => {
    if (action.type === FETCH_VALIDATORS_SUCCESS) {
        return action.list;
    } else {
        return state;
    }
};

const validatorsListWithAddress = (state = [], action) => {
    if (action.type === FETCH_VALIDATOR_WITH_ADDRESS_SUCCESS) {
        return action.list;
    } else {
        return state;
    }
};

const validatorsRewardsList = (state = [], action) => {
    if (action.type === FETCH_VALIDATORS_REWARDS_SUCCESS) {
        return action.list;
    } else {
        return state;
    }
};

const validatorCommissionInfo = (state = {}, action) => {
    if (action.type === FETCH_VALIDATOR_COMMISSION_INFO_SUCCESS) {
        return action.list;
    } else {
        return state;
    }
};


export default combineReducers({
    activeList,
    inActiveList,
    activeVotingPower,
    inActiveVotingPower,
    inProgress,
    validators,
    validatorsListWithAddress,
    validatorsRewardsList,
    rewardsInProgress,
    validatorCommissionInfo
});