import React from 'react';
import Button from "./../../../../components/Button";
import {submitFormData} from "../../../../store/actions/transactions/withdrawValidatorRewards";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../../store/actions/transactions/keplr";
import { WithdrawMsg} from "../../../../utils/protoMsgHelper";


const ButtonSubmit = () => {
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    const validatorRewards = useSelector((state) => state.validators.validatorRewards);

    const validator = useSelector((state) => state.validators.validator.value);

    const onClick = () => {
        dispatch(submitFormData([WithdrawMsg(loginInfo.address, validator.operatorAddress)]));
    };


    const disable = (
        validatorRewards.value === '' || validatorRewards.error.message !== '' || validator === ''
    );

    const onClickKeplr = () => {
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
                    onClick={loginInfo.loginMode === "keplr" ? onClickKeplr : onClick}
                />
            </div>
        </div>
    );
};



export default ButtonSubmit;
