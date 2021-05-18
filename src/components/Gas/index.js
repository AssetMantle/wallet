import React from 'react';
import transactions from "../../utils/transactions";
import {connect} from "react-redux";
import {useTranslation} from "react-i18next";
import config from "../../config";

const GasContainer = (props) => {
    const {t} = useTranslation();
    return (
        <>
            <div className="fee-container">
                <div className={props.activeFeeState === "Low" ? "fee-box active": "fee-box"} onClick={()=>props.onClick("Low", config.lowFee)}>
                    <p className="title">Low</p>
                    <p className="gas">{(transactions.XprtConversion(props.gas * config.lowFee)*props.tokenPrice).toFixed(4)} $</p>
                    <p className="xprt">{(transactions.XprtConversion(props.gas * config.lowFee)).toFixed(4)} XPRT</p>

                </div>`
                <div className={props.activeFeeState === "Average" ? "fee-box active": "fee-box"} onClick={()=>props.onClick("Average", config.averageFee)}>
                    <p className="title">Average</p>
                    <p className="gas">{(transactions.XprtConversion(props.gas * config.averageFee)*props.tokenPrice).toFixed(4)} $</p>
                    <p className="xprt">{(transactions.XprtConversion(props.gas * config.averageFee)).toFixed(4)} XPRT</p>
                </div>
                <div className={props.activeFeeState === "High" ? "fee-box active": "fee-box"} onClick={()=>props.onClick("High", config.highFee)}>
                    <p className="title">High</p>
                    <p className="gas">{(transactions.XprtConversion(props.gas * config.highFee)*props.tokenPrice).toFixed(4)} $</p>
                    <p className="xprt">{(transactions.XprtConversion(props.gas * config.highFee)).toFixed(4)} XPRT</p>
                </div>
            </div>
            <div className="form-field p-0">
                <p className="label"></p>
                <div className="amount-field">
                    <p className={props.checkAmountError ? "show amount-error text-left" : "hide amount-error text-left"}>{t("AMOUNT_ERROR_MESSAGE")}</p>
                </div>
            </div>
        </>

    );
};

const stateToProps = (state) => {
    return {
        balance: state.balance.amount,
        tokenPrice: state.tokenPrice.tokenPrice,
    };
};

export default connect(stateToProps)(GasContainer);
