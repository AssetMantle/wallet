import React from 'react';
import Button from "./../../../../components/Button";
import {submitFormData} from "../../../../store/actions/transactions/delegate";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../../store/actions/transactions/keplr";
import config from "../../../../config";
import {DelegateMsg} from "../../../../utils/protoMsgHelper";

const ButtonSubmit = () => {
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    const amount = useSelector((state) => state.delegate.amount);

    const validatorAddress = useSelector((state) => state.validators.validator);

    const onClick = () => {
        dispatch(submitFormData([DelegateMsg(loginInfo.address, validatorAddress.value.operatorAddress, (amount.value * config.xprtValue).toFixed(0), config.coinDenom)]));
    };


    const disable = (
        amount.value === '' || amount.error.message !== '' || validatorAddress.value === '' || validatorAddress.error.message !== ''
    );

    const onClickKeplr = () => {
        dispatch(keplrSubmit( [DelegateMsg(loginInfo.address, validatorAddress.value.operatorAddress, (amount.value * config.xprtValue).toFixed(0), config.coinDenom)]));
    };

    return (
        <div className="buttons">
            <div className="button-section">
                <Button
                    className="button button-primary"
                    type="button"
                    disable={disable}
                    value="Submit"
                    onClick={loginInfo.loginMode === "keplr" ? onClickKeplr : onClick}
                />
            </div>
        </div>
    );
};



export default ButtonSubmit;
