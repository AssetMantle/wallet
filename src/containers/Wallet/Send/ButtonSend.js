import React from 'react';
import Button from "./../../../components/Button";
import {submitFormData} from "../../../store/actions/transactions/send";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../store/actions/transactions/keplr";
import {SendMsg} from "../../../utils/protoMsgHelper";
import config from "../../../config";
import {setTxName} from "../../../store/actions/transactions/common";
import {stringToNumber, unDecimalize} from "../../../utils/scripts";
import {LOGIN_INFO} from "../../../constants/localStorage";

const ButtonSend = () => {
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem(LOGIN_INFO));

    const onClick = () => {
        dispatch(submitFormData([SendMsg(loginInfo && loginInfo.address, toAddress.value, (amount.value * config.tokenValue).toFixed(0), token.value.tokenDenom)]));
    };
    const amount = useSelector((state) => state.send.amount);
    const toAddress = useSelector((state) => state.send.toAddress);
    const token = useSelector((state) => state.send.token);
    const memo = useSelector((state) => state.send.memo);
    console.log(token, "token");
    const disable = (
        amount.value === '' || stringToNumber(amount.value) === 0 || amount.error.message !== '' || toAddress.value === '' || toAddress.error.message !== '' || memo.error.message !== ''
    );

    const onClickKeplr = () => {
        dispatch(setTxName({
            value: {
                name: "send",
            }
        }));
        let sendAmount;
        if(token.value.tokenDenom === config.pstakeTokenDenom){
            // console.log(unDecimalize(Decimal.fromAtomics(amount.value, 18).toString(), 18))
            sendAmount = Number(unDecimalize(amount.value, 18)).toString();
        }else {
            sendAmount = amount.value * config.tokenValue;
        }
        console.log(sendAmount, "sendAmount");
        dispatch(keplrSubmit([SendMsg(loginInfo && loginInfo.address, toAddress.value, sendAmount, token.value.token)], token));
    };

    return (
        <div className="buttons">
            <div className="button-section">
                <Button
                    className="button button-primary"
                    type="button"
                    disable={disable}
                    value="Send"
                    onClick={loginInfo && loginInfo.loginMode === config.keplrMode ? onClickKeplr : onClick}
                />
            </div>
        </div>
    );
};


export default ButtonSend;
