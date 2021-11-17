import React from 'react';
import Button from "./../../../components/Button";
// import {keyStoreTxSend} from "../../../actions/transactions/send";
import {useDispatch, useSelector} from "react-redux";
import {keyStoreSubmit} from "../../../actions/transactions/keyStore";

const Submit = () => {
    let loginAddress = localStorage.getItem('address');
    let loginMode = localStorage.getItem('loginMode');
    const type = useSelector((state) => state.common.txInfo.value.name);

    const dispatch = useDispatch();

    const onClick = () => {
        if(loginMode === "ledger"){
            console.log("");
        }else {
            dispatch(keyStoreSubmit(loginAddress, type));
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
