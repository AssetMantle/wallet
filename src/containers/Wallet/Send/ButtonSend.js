import React from 'react';
import Button from "./../../../components/Button";
import {submitFormData} from "../../../store/actions/transactions/send";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../store/actions/transactions/keplr";
import {SendMsg} from "../../../utils/protoMsgHelper";
import config from "../../../config";
import {setTxName} from "../../../store/actions/transactions/common";

const ButtonSend = () => {
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));

    const onClick = () => {
        dispatch(submitFormData([SendMsg(loginInfo.address, toAddress.value, (amount.value * config.xprtValue).toFixed(0), token.value.tokenDenom)]));
    };
    const amount = useSelector((state) => state.send.amount);
    const toAddress = useSelector((state) => state.send.toAddress);
    const token = useSelector((state) => state.send.token);
    const memo = useSelector((state) => state.send.memo);
    const disable = (
        amount.value === '' || amount.error.message !== '' || toAddress.value === '' || toAddress.error.message !== '' || memo.error.message !== ''
    );

    const onClickKeplr = () => {
        dispatch(setTxName({
            value:{
                name:"send",
            }
        }));
        dispatch(keplrSubmit( [SendMsg(loginInfo.address, toAddress.value, (amount.value * config.xprtValue).toFixed(0), token.value.tokenDenom)]));
    };

    console.log(loginInfo, "info");
    return (
        <div className="buttons">
            <div className="button-section">
                <Button
                    className="button button-primary"
                    type="button"
                    disable={disable}
                    value="Send"
                    onClick={loginInfo.loginMode === "keplr" ? onClickKeplr : onClick}
                />
            </div>
        </div>
    );
};



export default ButtonSend;
