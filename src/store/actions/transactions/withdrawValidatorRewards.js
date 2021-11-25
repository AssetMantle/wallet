import {
    TX_VALIDATOR_REWARDS_WITHDRAW_SHOW,
    TX_VALIDATOR_REWARDS_WITHDRAW_HIDE,
} from "../../../constants/withdrawValidatorRewards";
import {setTxName} from "./common";
import {showFeeModal} from "./fee";

export const showTxWithdrawValidatorRewardsModal = (data) => {
    return {
        type: TX_VALIDATOR_REWARDS_WITHDRAW_SHOW,
        data,
    };
};

export const hideTxWithdrawValidatorRewardsModal = (data) => {
    return {
        type: TX_VALIDATOR_REWARDS_WITHDRAW_HIDE,
        data,
    };
};

export const submitFormData = (message) => (dispatch, getState) => {
    dispatch(setTxName({
        value:{
            name:"withdrawValidatorRewards",
            modal:showTxWithdrawValidatorRewardsModal(),
            data:{
                message:message,
                memo:getState().common.memo.value,
            }
        }
    }));
    dispatch(hideTxWithdrawValidatorRewardsModal());
    dispatch(showFeeModal());
};