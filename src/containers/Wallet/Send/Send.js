import React from 'react';
import Button from "./../../../components/Button";
import {submitFormData} from "../../../actions/transactions/send";
import {useDispatch, useSelector} from "react-redux";

const SendButton = () => {
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(submitFormData());
    };
    const amount = useSelector((state) => state.send.amount);
    const toAddress = useSelector((state) => state.send.toAddress);

    const disable = (
        amount.value === '' || amount.error.message !== '' || toAddress.value === '' || toAddress.error.message !== ''
    );
    console.log(amount.value === '' , amount.error.message !== '' , toAddress.value === '' , toAddress.error.message !== '' , disable, "buton");
    //
    // const onClick = () => {
    //     dispatch(keplrTxSend(loginAddress));
    // };
    return (
        <div className="buttons">
            <div className="button-section">
                <Button
                    className="button button-primary"
                    type="button"
                    disable={disable}
                    value="Send"
                    onClick={onClick}
                />
            </div>
        </div>
    );
};



export default SendButton;
