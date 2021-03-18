import {
    TX_DELEGATE_ERROR,
    TX_DELEGATE_MODAL_HIDE,
    TX_DELEGATE_MODAL_SHOW,
    TX_DELEGATE_SUCCESS,
} from '../../constants/transactions';
import { combineReducers } from 'redux';


const modal = (state = false, {
    type,
}) => {
    switch (type) {
        case TX_DELEGATE_MODAL_SHOW:
            return true;
        case TX_DELEGATE_MODAL_HIDE:
        case TX_DELEGATE_ERROR:
        case TX_DELEGATE_SUCCESS:
            return false;
        default:
            return state;
    }
};

export default combineReducers({
    modal,
});
