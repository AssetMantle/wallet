import React from 'react';
import Button from "./../../../components/Button";
import {submitFormData} from "../../../store/actions/transactions/sendIbc";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../store/actions/transactions/keplr";
import config from "../../../config";
import transactions from "../../../utils/transactions";
import {setTxName, txFailed} from "../../../store/actions/transactions/common";
import * as Sentry from "@sentry/browser";
import {stringToNumber} from "../../../utils/scripts";
import {LOGIN_INFO} from "../../../constants/localStorage";

const ButtonSend = () => {
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem(LOGIN_INFO));
    const amount = useSelector((state) => state.sendIbc.amount);
    const toAddress = useSelector((state) => state.sendIbc.toAddress);
    const token = useSelector((state) => state.sendIbc.token);
    const chainInfo = useSelector((state) => state.sendIbc.chainInfo.value);
    const customPort = useSelector((state) => state.sendIbc.customPort);
    const customChannel = useSelector((state) => state.sendIbc.customChannel);
    let inputChannelID = chainInfo.customChain ? customChannel.value : chainInfo.chainID;
    let inputPort = chainInfo.customChain ? customPort.value : "transfer";
    const memo = useSelector((state) => state.sendIbc.memo);

    const disable = (
        amount.value === '' || stringToNumber(amount.value) === 0 || amount.error.message !== '' || toAddress.value === ''
        || toAddress.error.message !== '' || memo.error.message !== '' || chainInfo.chain === ''
    );

    const onClick = async () => {
        let msg = transactions.MakeIBCTransferMsg(inputChannelID, loginInfo && loginInfo.address,
            toAddress.value, (amount.value * config.tokenValue), undefined, undefined,
            token.value.tokenDenom, chainInfo.selectedChannel ? chainInfo.selectedChannel.url : undefined, inputPort);
        msg.then(result => {
            dispatch(submitFormData([result], inputPort, inputChannelID));
        }).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            dispatch(txFailed(error.message));
        });

    };

    const onClickKeplr = async () => {
        dispatch(setTxName({
            value: {
                name: "ibc",
            }
        }));
        let msg = transactions.MakeIBCTransferMsg(inputChannelID, loginInfo && loginInfo.address,
            toAddress.value, (amount.value * config.tokenValue), undefined, undefined,
            token.value.tokenDenom, chainInfo.selectedChannel ? chainInfo.selectedChannel.url : undefined, inputPort);
        msg.then(result => {
            dispatch(keplrSubmit([result]));
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
                    onClick={loginInfo && loginInfo.loginMode === config.keplrMode ? onClickKeplr : onClick}
                />
            </div>
        </div>
    );
};


export default ButtonSend;
