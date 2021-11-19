import React from 'react';
import Button from "./../../../components/Button";
import {submitFormData} from "../../../store/actions/transactions/send";
import {useDispatch, useSelector} from "react-redux";
import {keplrTxSend} from "../../../store/actions/transactions/keplr";

const ButtonSend = () => {
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(submitFormData());
    };
    const loginInfo = useSelector((state) => state.common.loginInfo.value);
    const amount = useSelector((state) => state.send.amount);
    const toAddress = useSelector((state) => state.send.toAddress);

    const disable = (
        amount.value === '' || amount.error.message !== '' || toAddress.value === '' || toAddress.error.message !== ''
    );

    const onClickKeplr = () => {
        dispatch(keplrTxSend(loginInfo.address));
    };

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
