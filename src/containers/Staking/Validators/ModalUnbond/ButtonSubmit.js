import React from 'react';
import Button from "./../../../../components/Button";
import {hideTxUnbondModal, submitFormData} from "../../../../store/actions/transactions/unbond";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../../store/actions/transactions/keplr";
import config from "../../../../config";
import {UnbondMsg} from "../../../../utils/protoMsgHelper";
import {setTxIno} from "../../../../store/actions/transactions/common";


const ButtonSubmit = () => {
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    const amount = useSelector((state) => state.unbondTx.amount);
    const memo = useSelector((state) => state.unbondTx.memo);
    const validator = useSelector((state) => state.validators.validator.value);

    const onClick = () => {
        dispatch(submitFormData([UnbondMsg(loginInfo.address, validator.operatorAddress, (amount.value * config.xprtValue).toFixed(0))]));
    };


    const disable = (
        amount.value === '' || amount.error.message !== '' || validator === '' || memo.error.message !== ''
    );

    const onClickKeplr = () => {
        dispatch(setTxIno({
            value:{
                modal:hideTxUnbondModal(),
                data:{
                    message:'',
                    memo:'',
                }
            }
        }));
        dispatch(keplrSubmit([UnbondMsg(loginInfo.address, validator.operatorAddress, (amount.value * config.xprtValue).toFixed(0))]));
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
