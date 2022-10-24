import {SET_COSMOSTATION_INFO, SIGN_IN_COSMOSTATION_MODAL_HIDE, SIGN_IN_COSMOSTATION_MODAL_SHOW} from "../../../constants/signIn/cosmostation";
import {combineReducers} from "redux";

const cosmostationModal = (state = false, {
    type,
}) => {
    switch (type) {
    case SIGN_IN_COSMOSTATION_MODAL_SHOW:
        return true;
    case SIGN_IN_COSMOSTATION_MODAL_HIDE:
        return false;
    default:
        return state;
    }
};

const cosmostationInfo = (state = {
    value: '',
    error: {
        message: '',
    },
}, {
    type,
    data,
}) => {
    switch (type) {
    case SET_COSMOSTATION_INFO:
        return {
            ...state,
            value: data.value,
            error: {
                ...state.error,
                message: data.error.message,
            },
        };
    case SIGN_IN_COSMOSTATION_MODAL_HIDE:
        return {
            ...state,
            value: '',
            error: {
                ...state.error,
                message: '',
            },
        };
    default:
        return state;
    }
};


export default combineReducers({
    cosmostationModal,
    cosmostationInfo
});
