import React from 'react';
import Button from "./../../../../components/Button";
import {
    hideTxWithdrawValidatorRewardsModal,
    submitFormData
} from "../../../../store/actions/transactions/withdrawValidatorRewards";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../../store/actions/transactions/keplr";
import {WithdrawMsg} from "../../../../utils/protoMsgHelper";
import {setTxIno} from "../../../../store/actions/transactions/common";
import config from "../../../../config";

const ButtonSubmit = () => {
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    const validatorRewards = useSelector((state) => state.validators.validatorRewards);
    const memo = useSelector((state) => state.withdrawValidatorRewards.memo);
    const validator = useSelector((state) => state.validators.validator.value);

    const onClick = () => {
        dispatch(submitFormData([WithdrawMsg(loginInfo.address, validator.operatorAddress)]));
    };


    const disable = (
        validatorRewards.value === '' || (validatorRewards.value*1) === 0 || validatorRewards.error.message !== '' || validator === '' || validatorRewards.value === 0 || memo.error.message !== ''
    );

    const onClickKeplr = () => {
        dispatch(setTxIno({
            value: {
                modal: hideTxWithdrawValidatorRewardsModal(),
                data: {
                    message: '',
                    memo: '',
                }
            }
        }));
        dispatch(keplrSubmit([WithdrawMsg(loginInfo.address, validator.operatorAddress)]));
    };

    return (
        <div className="buttons">
            <div className="button-section">
                <Button
                    className="button button-primary"
                    type="button"
                    disable={disable}
                    value="Submit"
                    onClick={loginInfo.loginMode === config.keplrMode ? onClickKeplr : onClick}
                />
            </div>
        </div>
    );
};


export default ButtonSubmit;
