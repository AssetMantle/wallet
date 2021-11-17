import React from 'react';
import Button from "./../../../components/Button";
import {feeSubmitKeyStore} from "../../../actions/transactions/fee";
import {useDispatch, useSelector} from "react-redux";
import {keyStoreSubmit} from "../../../actions/transactions/keyStore";

const Submit = () => {
    let loginMode = localStorage.getItem('loginMode');
    let loginAddress = localStorage.getItem('address');

    const dispatch = useDispatch();

    const onClick = () => {
        if(loginMode === "ledger"){
            dispatch(keyStoreSubmit(loginAddress, loginMode, "send"));
            console.log("");
        }else {
            dispatch(feeSubmitKeyStore());
        }
    };

    const fee = useSelector((state) => state.fee.fee);
    const gas= useSelector((state) => state.gas.gas);

    const disable = (
        fee.error.message !== '' || gas.error.message !== ''
    );
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
                    value="Next"
                    onClick={onClick}
                />
            </div>
        </div>
    );
};

export default Submit;
