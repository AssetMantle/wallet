import React from 'react';
import InputFieldNumber from "../../../components/InputFieldNumber";
import {setTxIbcSendAmount} from "../../../store/actions/transactions/sendIbc";
import {useDispatch, useSelector} from "react-redux";
import {formatNumber, removeCommas} from "../../../utils/scripts";
import NumberView from "../../../components/NumberView";
import {ValidateSendAmount, ValidateSpecialCharacters} from "../../../utils/validations";
import {useTranslation} from "react-i18next";
import {OverlayTrigger, Popover} from "react-bootstrap";
import config from "../../../config";
import helper from "../../../utils/helper";

const Amount = () => {
    const {t} = useTranslation();
    const amount = useSelector((state) => state.sendIbc.amount);
    const token = useSelector((state) => state.sendIbc.token.value);
    const transferableAmount = useSelector((state) => state.balance.transferableAmount);

    const dispatch = useDispatch();

    const onChange = (evt) => {
        let rex = /^\d*\.?\d{0,6}$/;
        if (rex.test(evt.target.value)) {
            if (token.tokenDenom === config.coinDenom) {
                dispatch(setTxIbcSendAmount({
                    value: evt.target.value,
                    error: ValidateSendAmount(transferableAmount, (helper.stringToNumber(evt.target.value)))
                }));

            } else {
                dispatch(
                    setTxIbcSendAmount({
                        value: evt.target.value,
                        error: ValidateSendAmount(token.transferableAmount, (helper.stringToNumber(evt.target.value)))
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
                error: ValidateSendAmount(value, (helper.stringToNumber(value)))
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
                                    className="title">Transferable Balance:</span>
                                <span
                                    className="value"
                                    title={transferableAmount}>
                                    <NumberView value={formatNumber(transferableAmount)}/>
                                    {config.coinName}
                                </span> 
                            </span>
                            :
                            <OverlayTrigger trigger={['hover', 'focus']}
                                placement="bottom"
                                overlay={
                                    <Popover id="popover-memo">
                                        <Popover.Content>
                                            {`${token.transferableAmount.toLocaleString()} 
                                            ${helper.denomChange(token.tokenItem.denom.baseDenom)}
                                            ( IBC Trace path - ${token.tokenItem.denom.path} , 
                                            denom: ${token.tokenItem.denom.baseDenom} ) 
                                            ${token.tokenItem.denomTrace}`}
                                        </Popover.Content>
                                    </Popover>
                                }>
                                <span onClick={() => selectTotalBalanceHandler(removeCommas(formatNumber(token.transferableAmount)))}
                                    className={token.transferableAmount === 0 ? "empty info-data" : "info-data info-link"}>
                                    <span className="title">
                                        Transferable Balance:
                                    </span>
                                    <span className="value">
                                        {token.transferableAmount.toLocaleString()} {helper.denomChange(token.tokenItem.denom.baseDenom)}
                                    </span> 
                                </span>
                            </OverlayTrigger>

                        :
                        <span
                            className={transferableAmount === 0 ? "empty info-data" : "info-data info-link"}
                            onClick={() => selectTotalBalanceHandler(removeCommas(formatNumber(transferableAmount)))}><span
                                className="title">Transferable Balance:</span>
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
