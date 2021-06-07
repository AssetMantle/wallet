import React from 'react';
import transactions from "../../utils/transactions";
import {connect} from "react-redux";
import {useTranslation} from "react-i18next";
import config from "../../config";
import ModalGasAlert from "./ModalGasAlert";

const GasContainer = (props) => {
    let mode = localStorage.getItem('loginMode');
    const {t} = useTranslation();
    return (
        <>
            <p className="fee-title">Fee</p>
            <div className="fee-container">
                {mode === "normal" && (localStorage.getItem("fee") * 1) !== 0 ?
                    <>
                        <div className={props.activeFeeState === "Low" ? "fee-box active": "fee-box"} onClick={()=>props.onClick("Low", config.lowFee)}>
                            <p className="title">Low</p>
                            <p className="gas">{(transactions.XprtConversion(props.gas * config.lowFee)*props.tokenPrice).toLocaleString(undefined, { minimumFractionDigits: 4 })} $</p>
                            <p className="xprt">{(transactions.XprtConversion(props.gas * config.lowFee)).toLocaleString(undefined, { minimumFractionDigits: 4 })} XPRT</p>
                        </div>
                        <div className={props.activeFeeState === "Average" ? "fee-box active": "fee-box"} onClick={()=>props.onClick("Average", config.averageFee)}>
                            <p className="title">Average</p>
                            <p className="gas">{(transactions.XprtConversion(props.gas * config.averageFee)*props.tokenPrice).toLocaleString(undefined, { minimumFractionDigits: 4 })} $</p>
                            <p className="xprt">{(transactions.XprtConversion(props.gas * config.averageFee)).toLocaleString(undefined, { minimumFractionDigits: 4 })} XPRT</p>
                        </div>
                        <div className={props.activeFeeState === "High" ? "fee-box active": "fee-box"} onClick={()=>props.onClick("High", config.highFee)}>
                            <p className="title">High</p>
                            <p className="gas">{(transactions.XprtConversion(props.gas * config.highFee)*props.tokenPrice).toLocaleString(undefined, { minimumFractionDigits: 4 })} $</p>
                            <p className="xprt">{(transactions.XprtConversion(props.gas * config.highFee)).toLocaleString(undefined, { minimumFractionDigits: 4 })} XPRT</p>
                        </div>
                    </>
                    :
                    <div className={props.activeFeeState === "Zero" ? "fee-box active": "fee-box active"} onClick={()=>props.onClick("Low", 0)}>
                        <p className="title">Zero</p>
                        <p className="gas">0 $</p>
                        <p className="xprt">0 XPRT</p>
                    </div>
                }
            </div>
            <div className="form-field p-0">
                <p className="label"></p>
                <div className="amount-field">
                    <p className={props.checkAmountError ? "show amount-error text-left" : "hide amount-error text-left"}>{t("AMOUNT_ERROR_MESSAGE")}</p>
                </div>
            </div>
            {
                props.zeroFeeAlert ?
                    <ModalGasAlert setZeroFeeAlert={props.setZeroFeeAlert}/>
                    :""
            }
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
