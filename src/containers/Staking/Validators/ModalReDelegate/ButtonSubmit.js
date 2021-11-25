import React from 'react';
import Button from "./../../../../components/Button";
import {submitFormData} from "../../../../store/actions/transactions/redelegate";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../../store/actions/transactions/keplr";
import config from "../../../../config";
import {RedelegateMsg} from "../../../../utils/protoMsgHelper";

const ButtonSubmit = () => {
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    const amount = useSelector((state) => state.redelegate.amount);

    const toAddress = useSelector((state) => state.redelegate.toAddress);
    const validator = useSelector((state) => state.validators.validator.value);

    const onClick = () => {
        dispatch(submitFormData([RedelegateMsg(loginInfo.address, validator.operatorAddress, toAddress.value, (amount.value * config.xprtValue).toFixed(0))]));
    };


    const disable = (
        amount.value === '' || amount.error.message !== '' || toAddress.value === '' || toAddress.error.message !== ''
    );

    const onClickKeplr = () => {
        dispatch(keplrSubmit([RedelegateMsg(loginInfo.address, validator.operatorAddress, toAddress.value, (amount.value * config.xprtValue).toFixed(0))]));
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
