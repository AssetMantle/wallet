import {
    TX_DELEGATE_MODAL_HIDE,
    TX_DELEGATE_MODAL_SHOW,
} from '../../constants/transactions';

export const showTxDelegateModal = (data) => {
    return {
        type: TX_DELEGATE_MODAL_SHOW,
        data,
    };
};

export const hideTxDelegateModal = (data) => {
    return {
        type: TX_DELEGATE_MODAL_HIDE,
        data,
    };
};
