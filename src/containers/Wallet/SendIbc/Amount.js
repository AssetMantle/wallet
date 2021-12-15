import React from 'react';
import InputFieldNumber from "../../../components/InputFieldNumber";
import {setTxIbcSendAmount} from "../../../store/actions/transactions/sendIbc";
import {useDispatch, useSelector} from "react-redux";
import {formatNumber} from "../../../utils/scripts";
import NumberView from "../../../components/NumberView";
import {ValidateSendAmount, ValidateSpecialCharacters} from "../../../utils/validations";
import {useTranslation} from "react-i18next";
import {OverlayTrigger, Popover} from "react-bootstrap";

const Amount = () => {
    const {t} = useTranslation();
    const amount = useSelector((state) => state.sendIbc.amount);
    const token = useSelector((state) => state.sendIbc.token.value);
    const transferableAmount = useSelector((state) => state.balance.transferableAmount);

    const dispatch = useDispatch();

    const onChange = (evt) => {
        let rex = /^\d*\.?\d{0,6}$/;
        if (rex.test(evt.target.value)) {
            if (token.tokenDenom === "uxprt") {
                dispatch(setTxIbcSendAmount({
                    value: evt.target.value,
                    error: ValidateSendAmount(transferableAmount, (evt.target.value * 1))
                }));

            } else {
                dispatch(
                    setTxIbcSendAmount({
                        value: evt.target.value,
                        error: ValidateSendAmount(token.transferableAmount, (evt.target.value * 1))
                    })
                );
            }
        } else {
            return false;
        }
    };

    const selectTotalBalanceHandler = (value) => {
        dispatch(
            setTxIbcSendAmount({
                value: value,
                error: ValidateSendAmount(value, (value * 1))
            })
        );
    };

    return (
        <div className="form-field p-0">
            <p className="label amount-label">
                <span> {t("AMOUNT")}</span>
                {
                    Object.keys(token).length !== 0 ?
                        token.tokenDenom === "uxprt" ?
                            <span
                                className={transferableAmount === 0 ? "empty info-data" : "info-data info-link"}
                                onClick={() => selectTotalBalanceHandler(formatNumber(transferableAmount))}><span
                                    className="title">Transferable Balance:</span>
                                <span
                                    className="value"
                                    title={transferableAmount}>
                                    <NumberView value={formatNumber(transferableAmount)}/>XPRT
                                </span> 
                            </span>
                            :
                            <OverlayTrigger trigger={['hover', 'focus']}
                                placement="bottom"
                                overlay={
                                    <Popover id="popover-memo">
                                        <Popover.Content>
                                            {`${token.transferableAmount.toLocaleString()} 
                                            ATOM ( IBC Trace path - ${token.tokenItem.denom.path} , denom: ${token.tokenItem.denom.baseDenom} ) ${token.tokenItem.denomTrace}`}
                                        </Popover.Content>
                                    </Popover>
                                }>
                                <span onClick={() => selectTotalBalanceHandler(formatNumber(token.transferableAmount))}
                                    className={token.transferableAmount === 0 ? "empty info-data" : "info-data info-link"}>
                                    <span className="title">
                                        Transferable Balance:
                                    </span>
                                    <span className="value">
                                        {token.transferableAmount.toLocaleString()} ATOM 
                                    </span> 
                                </span>
                            </OverlayTrigger>

                        :
                        <span
                            className={transferableAmount === 0 ? "empty info-data" : "info-data info-link"}
                            onClick={() => selectTotalBalanceHandler(formatNumber(transferableAmount))}><span
                                className="title">Transferable Balance:</span>
                            <span
                                className="value"
                                title={transferableAmount}>
                                <NumberView value={formatNumber(transferableAmount)}/>XPRT
                            </span> 
                        </span>
                }
            </p>
            <div className="amount-field">
                <InputFieldNumber
                    className="form-control"
                    min={0}
                    name="Amount"
                    placeholder="Enter Amount"
                    required={true}
                    type="number"
                    value={amount.value}
                    onKeyPress={ValidateSpecialCharacters}
                    error={amount.error}
                    onChange={onChange}
                />

            </div>
        </div>
    );
};


export default Amount;
