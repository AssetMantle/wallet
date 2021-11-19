import {
    SIGN_IN_KEPLR_MODAL_SHOW,
    SIGN_IN_KEPLR_MODAL_HIDE,
    SET_KEPLR_INFO
} from "../../../constants/signIn/keplr";
import {combineReducers} from "redux";

const keplrModal = (state = false, {
    type,
}) => {
    switch (type) {
    case SIGN_IN_KEPLR_MODAL_SHOW:
        return true;
    case SIGN_IN_KEPLR_MODAL_HIDE:
        return false;
    default:
        return state;
    }
};

const keplrInfo = (state = {
    value: '',
    error: {
        message: '',
    },
}, {
    type,
    data,
}) => {
    switch (type) {
    case SET_KEPLR_INFO:
        return {
            ...state,
            value: data.value,
            error: {
                ...state.error,
                message: data.error.message,
            },
        };
    default:
        return state;
    }
};


export default combineReducers({
    keplrModal,
    keplrInfo
});
