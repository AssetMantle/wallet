import {combineReducers} from 'redux';
import {FEE_MODAL_HIDE, FEE_MODAL_SHOW, TX_FEE_SET} from "../../../constants/fee";
import {TX_RESULT_MODAL_HIDE, TX_SUCCESS} from "../../../constants/common";
import config from "../../../config";

const fee = (state = {
    value: {
        fee: config.averageFee,
        feeType: "Average",
    },
    error: {
        message: '',
    },
}, {
    type,
    data,
}) => {
    switch (type) {
    case TX_FEE_SET:
        return {
            ...state,
            value: data.value,
            error: {
                ...state.error,
                message: data.error.message,
            },
        };
    case TX_SUCCESS:
    case FEE_MODAL_HIDE:
    case TX_RESULT_MODAL_HIDE:
        return {
            ...state,
            value: {
                fee: config.averageFee,
                feeType: "Average",
            },
            error: {
                ...state.error,
                message: '',
            },
        };
    default:
        return state;
    }
};

const modal = (state = false, {
    type,
}) => {
    switch (type) {
    case FEE_MODAL_SHOW:
        return true;
    case FEE_MODAL_HIDE:
        return false;
    default:
        return state;
    }
};

export default combineReducers({
    fee,
    modal
});
