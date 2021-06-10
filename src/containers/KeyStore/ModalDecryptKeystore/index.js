import {
    Modal,
    Form
} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import config from "../../../config";
import transactions from "../../../utils/transactions";
import {connect} from "react-redux";
import Icon from "../../../components/Icon";

const ModalDecryptKeyStore = (props) => {
    const {t} = useTranslation();
    const [showGasField, setShowGasField] = useState(false);
    const [gasValidationError, setGasValidationError] = useState(false);
    const [activeFeeState, setActiveFeeState] = useState("Average");
    const [checkAmountError, setCheckAmountError] = useState(false);

    useEffect(() => {
        console.log(props.gas , props.fee, props.gas*props.fee, "props");
        if((props.transferableAmount - (props.amountField*1)) < transactions.XprtConversion(props.gas * props.fee)){
            setCheckAmountError(true);
        }else {
            setCheckAmountError(false);
        }
        props.setFee(props.gas * props.fee);
    }, []);
    const handleGas = () => {
        setShowGasField(!showGasField);
    };
    const handleGasChange = (event) => {
        if((event.target.value * 1) >= 80000 && (event.target.value * 1) <= 2000000){
            setGasValidationError(false);
            props.setGas(event.target.value * 1);
            if((localStorage.getItem("fee") * 1) !== 0) {
                if (activeFeeState === "Average") {
                    props.setFee((event.target.value * 1) * config.averageFee);
                } else if (activeFeeState === "High") {
                    props.setFee((event.target.value * 1) * config.highFee);
                } else if (activeFeeState === "Low") {
                    props.setFee((event.target.value * 1) * config.lowFee);
                }
                if (activeFeeState === "Average" && (transactions.XprtConversion((event.target.value * 1) * config.averageFee)) + props.amountField > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "High" && (transactions.XprtConversion((event.target.value * 1) * config.highFee)) + props.amountField > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "Low" && (transactions.XprtConversion((event.target.value * 1) * config.lowFee)) + props.amountField > props.transferableAmount) {
                    setCheckAmountError(true);
                } else {
                    setCheckAmountError(false);
                }
            }
        }else {
            setGasValidationError(true);
        }


    };

    const handleFee = (feeType, feeValue) => {
        setActiveFeeState(feeType);
        props.setFee(props.gas * feeValue);
        console.log(props.gas , feeValue, props.gas*feeValue, "re123");
        if ((props.transferableAmount - (props.amountField*1)) < transactions.XprtConversion(props.gas * feeValue)) {
            setCheckAmountError(true);
        }else {
            setCheckAmountError(false);
        }
    };

    const handleNext = () => {
        if(props.modalName === "delegate") {
            props.showSeedModal(true);
            props.setFeeModal(false);
            props.setGas(config.gas);
            props.setFee(config.averageFee);
        }
        else {
            props.setShow(true);
            props.setMnemonicForm(true);
            props.setFeeModal(false);
        }
    };

    const handlePrevious = () =>{
        if(props.modalName === "delegate"){
            props.setFeeModal(false);
            props.setInitialModal(true);
            setCheckAmountError(false);
            props.setGas(config.gas);
            props.setFee(config.averageFee);
        }
    };
    return (
        <>
            <Modal.Header className="result-header success" closeButton>
                <div className="previous-section txn-header">
                    <button className="button" onClick={() => handlePrevious()}>
                        <Icon
                            viewClass="arrow-right"
                            icon="left-arrow"/>
                    </button>
                </div>
                <h3 className="heading">Fee</h3>
            </Modal.Header>
            <Modal.Body className="create-wallet-body import-wallet-body">
                <>
                    <p className="fee-title text-center">Fee</p>
                    <div className="fee-container">
                        <>
                            {
                                props.transferableAmount <= 0 ?
                                    <div className={activeFeeState === "Low" ? "fee-box active": "fee-box"} onClick={()=>handleFee("Low", config.lowFee)}>
                                        <p className="title">Low</p>
                                        <p className="gas">{(transactions.XprtConversion(props.gas * config.lowFee)*props.tokenPrice).toLocaleString(undefined, { minimumFractionDigits: 4 })} $</p>
                                        <p className="xprt">{(transactions.XprtConversion(props.gas * config.lowFee)).toLocaleString(undefined, { minimumFractionDigits: 4 })} XPRT</p>
                                    </div>
                                    : null
                            }
                            <div className={activeFeeState === "Average" ? "fee-box active": "fee-box"} onClick={()=>handleFee("Average", config.averageFee)}>
                                <p className="title">Average</p>
                                <p className="gas">{(transactions.XprtConversion(props.gas * config.averageFee)*props.tokenPrice).toLocaleString(undefined, { minimumFractionDigits: 4 })} $</p>
                                <p className="xprt">{(transactions.XprtConversion(props.gas * config.averageFee)).toLocaleString(undefined, { minimumFractionDigits: 4 })} XPRT</p>
                            </div>
                            <div className={activeFeeState === "High" ? "fee-box active": "fee-box"} onClick={()=>handleFee("High", config.highFee)}>
                                <p className="title">High</p>
                                <p className="gas">{(transactions.XprtConversion(props.gas * config.highFee)*props.tokenPrice).toLocaleString(undefined, { minimumFractionDigits: 4 })} $</p>
                                <p className="xprt">{(transactions.XprtConversion(props.gas * config.highFee)).toLocaleString(undefined, { minimumFractionDigits: 4 })} XPRT</p>
                            </div>
                        </>

                    </div>
                    <div className="form-field p-0">
                        <p className="label"></p>
                        <div className="amount-field">
                            <p className={checkAmountError ? "show amount-error text-left" : "hide amount-error text-left"}>{t("AMOUNT_ERROR_MESSAGE")}</p>
                        </div>
                    </div>
                </>
                <div className="select-gas">
                    <p onClick={handleGas} className="text-center">{!showGasField ? "Set gas" : "Close"}</p>
                </div>
                {showGasField
                    ?
                    <div className="form-field">
                        <p className="label info">{t("GAS")}</p>
                        <div className="amount-field">
                            <Form.Control
                                type="number"
                                min={80000}
                                max={2000000}
                                name="gas"
                                placeholder={t("ENTER_GAS")}
                                step="any"
                                defaultValue={props.gas}
                                onChange={handleGasChange}
                                required={false}
                            />
                            {
                                gasValidationError ?
                                    <span className="amount-error">
                                        {t("GAS_WARNING")}
                                    </span> : ""
                            }
                        </div>
                    </div>
                    : ""
                }
                <div className="buttons">
                    <button className="button button-primary" onClick={handleNext}>{t("NEXT")}</button>
                </div>
            </Modal.Body>
        </>
    );
};

const stateToProps = (state) => {
    return {
        balance: state.balance.amount,
        tokenPrice: state.tokenPrice.tokenPrice,
        transferableAmount: state.balance.transferableAmount,
    };
};

export default connect(stateToProps)(ModalDecryptKeyStore);
