import React from 'react';
import InputFieldNumber from "../../../components/InputFieldNumber";
import {setTxSendAmount} from "../../../store/actions/transactions/send";
import {useDispatch, useSelector} from "react-redux";
import {formatNumber, removeCommas, stringToNumber} from "../../../utils/scripts";
import NumberView from "../../../components/NumberView";
import {ValidateSendAmount, ValidateSpecialCharacters} from "../../../utils/validations";
import {useTranslation} from "react-i18next";
import config from "../../../config";
import helper from "../../../utils/helper";

const Amount = () => {
    const {t} = useTranslation();
    const amount = useSelector((state) => state.send.amount);
    const token = useSelector((state) => state.send.token.value);
    const transferableAmount = useSelector((state) => state.balance.transferableAmount);

    const dispatch = useDispatch();

    const onChange = (evt) => {
        let rex = /^\d*\.?\d{0,6}$/;
        if (rex.test(evt.target.value)) {
            if (token.tokenDenom === config.coinDenom) {
                dispatch(setTxSendAmount({
                    value: evt.target.value,
                    error: ValidateSendAmount(transferableAmount, (stringToNumber(evt.target.value)))
                }));

            } else {
                dispatch(
                    setTxSendAmount({
                        value: evt.target.value,
                        error: ValidateSendAmount(token.transferableAmount, (stringToNumber(evt.target.value)))
                    })
                );
            }
        } else {
            return false;
        }
    };

    const selectTotalBalanceHandler = (value) => {
        dispatch(
            setTxSendAmount({
                value: value,
                error: ValidateSendAmount(value, (stringToNumber(value )))
            })
        );
    };


    return (
        <div className="form-field p-0">
            <p className="label amount-label">
                <span> {t("AMOUNT")}</span>
                {
                    Object.keys(token).length !== 0 ?
                        token.tokenDenom === config.coinDenom ?
                            <span
                                className={transferableAmount === 0 ? "empty info-data" : "info-data info-link"}
                                onClick={() => selectTotalBalanceHandler(removeCommas(formatNumber(transferableAmount)))}><span
                                    className="title">{t("TRANSFERABLE_BALANCE")}:</span>
                                <span
                                    className="value"
                                    title={transferableAmount}>
                                    <NumberView value={formatNumber(transferableAmount)}/>{config.coinName}
                                </span> 
                            </span>
                            :
                            <span title={token.tokenItem.denomTrace}
                                className={token.transferableAmount === 0 ? "empty info-data" : "info-data"}>
                                <span
                                    className="title">Transferable Balance:</span>
                                <span
                                    className="value">{token.transferableAmount.toLocaleString()}
                                    {helper.denomChange(token.tokenItem.denom.baseDenom)}
                                    ( IBC Trace path - {token.tokenItem.denom.path} ,
                                    denom: {token.tokenItem.denom.baseDenom} )
                                </span>
                            </span>
                        :
                        <span
                            className={transferableAmount === 0 ? "empty info-data" : "info-data info-link"}
                            onClick={() => selectTotalBalanceHandler(removeCommas(formatNumber(transferableAmount)))}><span
                                className="title">{t("TRANSFERABLE_BALANCE")}:</span>
                            <span
                                className="value"
                                title={transferableAmount}>
                                <NumberView value={formatNumber(transferableAmount)}/>{config.coinName}
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
