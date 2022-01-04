import {Form, Modal} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import config from "../../config";
import transactions from "../../utils/transactions";
import {connect} from "react-redux";
import Icon from "../../components/Icon";
import ModalDecryptKeyStore from "../KeyStore/ModalDecryptKeystore";
import {fee as feeMessage} from "../../utils/aminoMsgHelper";
import ModalViewTxnResponse from "../Common/ModalViewTxnResponse";
import Loader from "../../components/Loader";
import {formatNumber} from "../../utils/scripts";
import NumberView from "../../components/NumberView";
import helper from "../../utils/helper";

const ModalGasAlert = (props) => {
    const {t} = useTranslation();
    const [showGasField, setShowGasField] = useState(false);
    const [gasValidationError, setGasValidationError] = useState(false);
    const [activeFeeState, setActiveFeeState] = useState("Average");
    const [checkAmountError, setCheckAmountError] = useState(false);
    const [showDecryptModal, setShowDecryptModal] = useState(false);
    const [feeModal, setFeeModal] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [gas, setGas] = useState(config.gas);
    const [fee, setFee] = useState(config.averageFee);
    const [response, setResponse] = useState('');
    const loginMode = localStorage.getItem('loginMode');
    const [loader, setLoader] = useState(false);

    const accountType = localStorage.getItem('account');
    useEffect(() => {
        if (props.formData.formName === "withdrawMultiple" || props.formData.formName === "withdrawAddress" || props.formData.formName === "withdrawValidatorRewards" || props.formData.formName === "redelegate" || props.formData.formName === "unbond") {
            if (props.transferableAmount < transactions.XprtConversion(gas * fee)) {
                setCheckAmountError(true);
            } else {
                setCheckAmountError(false);
            }
        } else if (accountType === "vesting" && props.formData.formName === "delegate") {
            if (props.transferableAmount < transactions.XprtConversion(gas * fee)) {
                setCheckAmountError(true);
            } else {
                setCheckAmountError(false);
            }
        } else {
            if ((props.transferableAmount - (helper.stringToNumber(props.formData.amount ))) < transactions.XprtConversion(gas * fee)) {
                setCheckAmountError(true);
            } else {
                setCheckAmountError(false);
            }
        }

        setFee(gas * fee);
    }, []);

    const amountTxns = (
        props.formData.formName === "withdrawMultiple" || props.formData.formName === "withdrawAddress" || props.formData.formName === "withdrawValidatorRewards" || props.formData.formName === "redelegate" || props.formData.formName === "unbond"
    );

    const vestingDelegationCheck = (
        accountType === "vesting" && props.formData.formName === "delegate"
    );
    const handleGas = () => {
        setShowGasField(!showGasField);
    };

    const handleGasChange = (event) => {
        if ((helper.stringToNumber(event.target.value)) >= 80000 && (helper.stringToNumber(event.target.value )) <= 2000000) {
            setGasValidationError(false);
            setGas(helper.stringToNumber(event.target.value ));

            if (activeFeeState === "Average") {
                setFee((helper.stringToNumber(event.target.value )) * config.averageFee);
            } else if (activeFeeState === "High") {
                setFee((helper.stringToNumber(event.target.value)) * config.highFee);
            } else if (activeFeeState === "Low") {
                setFee((helper.stringToNumber(event.target.value )) * config.lowFee);
            }
            if (amountTxns || vestingDelegationCheck) {
                if (activeFeeState === "Average" && (transactions.XprtConversion((helper.stringToNumber(event.target.value )) * config.averageFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "High" && (transactions.XprtConversion((helper.stringToNumber(event.target.value)) * config.highFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "Low" && (transactions.XprtConversion((helper.stringToNumber(event.target.value )) * config.lowFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else {
                    setCheckAmountError(false);
                }
            } else {
                if (activeFeeState === "Average" && (transactions.XprtConversion((helper.stringToNumber(event.target.value )) * config.averageFee)) + props.formData.amount > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "High" && (transactions.XprtConversion((helper.stringToNumber(event.target.value)) * config.highFee)) + props.formData.amount > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "Low" && (transactions.XprtConversion((helper.stringToNumber(event.target.value )) * config.lowFee)) + props.formData.amount > props.transferableAmount) {
                    setCheckAmountError(true);
                } else {
                    setCheckAmountError(false);

                }
            }
        } else {
            setGasValidationError(true);
        }


    };

    const handleFee = (feeType, feeValue) => {
        setActiveFeeState(feeType);
        setFee(gas * feeValue);
        if (amountTxns || vestingDelegationCheck) {
            if (props.transferableAmount < transactions.XprtConversion(gas * feeValue)) {
                setCheckAmountError(true);
            } else {
                setCheckAmountError(false);
            }
        } else {
            if ((props.transferableAmount - (helper.stringToNumber(props.formData.amount ))) < transactions.XprtConversion(gas * feeValue)) {
                setCheckAmountError(true);
            } else {
                setCheckAmountError(false);
            }
        }

    };

    const handleNext = () => {
        setShowDecryptModal(true);
        setFeeModal(false);
        if (props.formData.formName === "send" || props.formData.formName === "ibc") {
            props.formData.evt.target.reset();
            props.setEnteredAmount('');
        }
    };

    if (loader) {
        return <Loader/>;
    }

    const handleLedgerSubmit = async () => {
        setLoader(true);
        const loginAddress = localStorage.getItem('address');
        let response;

        let accountNumber = helper.stringToNumber(localStorage.getItem('accountNumber'));
        let addressIndex = helper.stringToNumber(localStorage.getItem('addressIndex'));

        if (props.formData.formName === "ibc") {
            let msg = transactions.MakeIBCTransferMsg(props.formData.channelID, loginAddress,
                props.formData.toAddress, (props.formData.amount * config.xprtValue).toFixed(0), undefined, undefined, props.formData.denom, props.formData.channelUrl, props.formData.inputPort);
            await msg.then(result => {
                response = transactions.TransactionWithMnemonic([result],
                    feeMessage(Math.trunc(fee), gas), props.formData.memo, "",
                    transactions.makeHdPath(accountNumber, addressIndex), "");
            }).catch(err => {
                setLoader(false);
                setErrorMessage(err.response
                    ? err.response.data.message
                    : err.message);
            });
        } else {
            response = transactions.getTransactionResponse(loginAddress, props.formData, fee, gas, "", accountNumber, addressIndex);
        }

        response.then(result => {
            setResponse(result);
            setLoader(false);
            setFeeModal(false);
        }).catch(err => {
            setLoader(false);
            setErrorMessage(err.response
                ? err.response.data.message
                : err.message);
        });
    };

    const handlePrevious = () => {
        if (props.formData.formName === "delegate") {
            props.setFeeModal(false);
            props.setInitialModal(true);
            setCheckAmountError(false);
            setGas(config.gas);
            setFee(config.averageFee);
        } else if (props.formData.formName === "send" || props.formData.formName === "ibc") {
            props.handleClose();
        } else {
            props.setFeeModal(false);
            props.setInitialModal(true);
        }
    };
    return (
        <>
            {feeModal ?
                <>
                    <Modal.Header className="result-header success" closeButton>
                        <div className="previous-section txn-header">
                            <button className="button" onClick={() => handlePrevious()}>
                                <Icon
                                    viewClass="arrow-right"
                                    icon="left-arrow"/>
                            </button>
                        </div>
                        <h3 className="heading">{props.formData.modalHeader}</h3>
                    </Modal.Header>
                    <Modal.Body className="create-wallet-body import-wallet-body">
                        <>
                            <p className="fee-title text-center">Fee</p>
                            <div className="fee-container">
                                <>
                                    {
                                        props.transferableAmount < config.averageFee ?
                                            <div className={activeFeeState === "Low" ? "fee-box active" : "fee-box"}
                                                onClick={() => handleFee("Low", config.lowFee)}>
                                                <p className="title">Zero</p>
                                                <p className="gas"><NumberView
                                                    value={formatNumber(transactions.XprtConversion(gas * config.lowFee) * props.tokenPrice)}/>$
                                                </p>
                                                <p className="xprt"><NumberView
                                                    value={formatNumber(transactions.XprtConversion(gas * config.lowFee))}/>XPRT
                                                </p>
                                            </div>
                                            : null
                                    }
                                    <div className={activeFeeState === "Average" ? "fee-box active" : "fee-box"}
                                        onClick={() => handleFee("Average", config.averageFee)}>
                                        <p className="title">Low</p>
                                        <p className="gas"><NumberView
                                            value={formatNumber(transactions.XprtConversion(gas * config.averageFee) * props.tokenPrice)}/>$
                                        </p>
                                        <p className="xprt"><NumberView
                                            value={formatNumber(transactions.XprtConversion(gas * config.averageFee))}/>XPRT
                                        </p>
                                    </div>
                                    <div className={activeFeeState === "High" ? "fee-box active" : "fee-box"}
                                        onClick={() => handleFee("High", config.highFee)}>
                                        <p className="title">High</p>
                                        <p className="gas"><NumberView
                                            value={formatNumber(transactions.XprtConversion(gas * config.highFee) * props.tokenPrice)}/>$
                                        </p>
                                        <p className="xprt"><NumberView
                                            value={formatNumber(transactions.XprtConversion(gas * config.highFee))}/>XPRT
                                        </p>
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
                            <p onClick={handleGas} className="text-center">{!showGasField ? "Advanced" : "Advanced"}
                                {!showGasField ?
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="down-arrow"/>
                                    :
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="up-arrow"/>}
                            </p>
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
                                        defaultValue={gas}
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
                        {
                            errorMessage !== "" ?
                                <p className="form-error">{errorMessage}</p>
                                : null
                        }
                        <div className="buttons">
                            <button className="button button-primary" disabled={gasValidationError || checkAmountError}
                                onClick={loginMode === "normal" ? handleNext : handleLedgerSubmit}>{loginMode === "normal" ? t("NEXT") : t("SUBMIT")}</button>
                        </div>
                    </Modal.Body>
                </> : ""
            }
            {showDecryptModal ?
                <ModalDecryptKeyStore
                    formData={props.formData}
                    fee={fee}
                    gas={gas}
                    handleClose={props.handleClose}
                    setShowDecryptModal={setShowDecryptModal}
                    setFeeModal={setFeeModal}
                />
                : ""
            }
            {response !== '' ?
                <ModalViewTxnResponse
                    response={response}
                    successMsg={props.formData.successMsg}
                    failedMsg={props.formData.failedMsg}
                    handleClose={props.handleClose}
                />
                : null}
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

export default connect(stateToProps)(ModalGasAlert);
