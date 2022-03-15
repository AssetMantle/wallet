import React from 'react';
import Button from "./../../../../components/Button";
import {hideTxDelegateModal, submitFormData} from "../../../../store/actions/transactions/delegate";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../../store/actions/transactions/keplr";
import config from "../../../../testConfig.json";
import {DelegateMsg} from "../../../../utils/protoMsgHelper";
import {setTxIno} from "../../../../store/actions/transactions/common";
import {LOGIN_INFO} from "../../../../constants/localStorage";
import {stringToNumber} from "../../../../utils/scripts";

const ButtonSubmit = () => {
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem(LOGIN_INFO));
    const amount = useSelector((state) => state.delegate.amount);
    const memo = useSelector((state) => state.delegate.memo);
    const validatorAddress = useSelector((state) => state.validators.validator);

    const onClick = () => {
        dispatch(submitFormData([DelegateMsg(loginInfo && loginInfo.address, validatorAddress.value.operatorAddress, (amount.value * config.tokenValue).toFixed(0), config.coinDenom)]));
    };


    const disable = (
        amount.value === '' || stringToNumber(amount.value) === 0  || amount.error.message !== '' || validatorAddress.value === '' || validatorAddress.error.message !== '' || memo.error.message !== ''
    );

    const onClickKeplr = () => {
        dispatch(setTxIno({
            value: {
                modal: hideTxDelegateModal(),
                data: {
                    message: '',
                    memo: '',
                }
            }
        }));
        dispatch(keplrSubmit([DelegateMsg(loginInfo && loginInfo.address, validatorAddress.value.operatorAddress, (amount.value * config.tokenValue).toFixed(0), config.coinDenom)]));
    };

    return (
        <div className="buttons">
            <div className="button-section">
                <Button
                    className="button button-primary"
                    type="button"
                    disable={disable}
                    value="Submit"
                    onClick={loginInfo && loginInfo.loginMode === config.keplrMode ? onClickKeplr : onClick}
                />
            </div>
        </div>
    );
};


export default ButtonSubmit;
