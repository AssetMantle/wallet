import React from 'react';
import Button from "./../../../components/Button";
import {submitFormData} from "../../../store/actions/transactions/sendIbc";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../store/actions/transactions/keplr";
import config from "../../../config";
import transactions from "../../../utils/transactions";
import {txFailed} from "../../../store/actions/transactions/common";
import * as Sentry from "@sentry/browser";

const ButtonSend = () => {
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    const amount = useSelector((state) => state.sendIbc.amount);
    const toAddress = useSelector((state) => state.sendIbc.toAddress);
    const token = useSelector((state) => state.sendIbc.token);
    const chainInfo = useSelector((state) => state.sendIbc.chainInfo.value);
    const customPort = useSelector((state) => state.sendIbc.customPort);
    const customChannel = useSelector((state) => state.sendIbc.customChannel);
    let inputChannelID = chainInfo.customChain ? customChannel.value : chainInfo.chainID;
    let inputPort = chainInfo.customChain ? customPort.value : "transfer";

    console.log(inputChannelID, inputPort, "inputPort");

    const disable = (
        amount.value === '' || amount.error.message !== '' || toAddress.value === '' || toAddress.error.message !== ''
    );

    const onClick = async () => {
        let msg = transactions.MakeIBCTransferMsg(inputChannelID, loginInfo.address,
            toAddress.value, (amount.value * config.xprtValue), undefined, undefined,
            token.value.tokenDenom, chainInfo.selectedChannel ? chainInfo.selectedChannel.url : undefined, inputPort);
        msg.then(result => {
            dispatch(submitFormData([result], inputPort, inputChannelID));
        }).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            dispatch(txFailed(error.message));
        });
        console.log(msg, "message");

    };

    const onClickKeplr = async () => {
        let msg = await transactions.MakeIBCTransferMsg(inputChannelID, loginInfo.address,
            toAddress.value, (amount.value * config.xprtValue), undefined, undefined,
            token.value.tokenDenom, chainInfo.selectedChannel ? chainInfo.selectedChannel.url : undefined, inputPort);
        msg.then(result => {
            dispatch(keplrSubmit( [result]));
        }).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            dispatch(txFailed(error.message));
        });

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
