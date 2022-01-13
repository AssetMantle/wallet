import React from 'react';
import Button from "./../../../components/Button";
import {feeChangeHandler, feeSubmitKeyStore} from "../../../store/actions/transactions/fee";
import {useDispatch, useSelector} from "react-redux";
import {ledgerSubmit} from "../../../store/actions/transactions/ledger";
import config from "../../../config";

const Submit = () => {
    let loginMode = localStorage.getItem('loginMode');
    let loginAddress = localStorage.getItem('address');

    const dispatch = useDispatch();

    const onClick = () => {
        if (loginMode === "ledger") {
            dispatch(feeChangeHandler({
                value: {
                    fee: config.averageFee,
                    feeType: "Average",
                },
                error: {
                    message: '',
                },
            }));
            dispatch(ledgerSubmit(loginAddress, loginMode));
        } else {
            dispatch(feeSubmitKeyStore());
        }
    };

    const fee = useSelector((state) => state.fee.fee);
    const gas = useSelector((state) => state.gas.gas);

    const disable = (
        fee.error.message !== '' || gas.error.message !== ''
    );

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
