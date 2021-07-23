import {
    Form,
    Modal,
    OverlayTrigger,
    Popover,
} from 'react-bootstrap';
import React, {useState} from 'react';
import Icon from "../../../../components/Icon";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import helper from "../../../../utils/helper";
import aminoMsgHelper from "../../../../utils/aminoMsgHelper";
import {RedelegateMsg} from "../../../../utils/protoMsgHelper";
import {connect} from "react-redux";
import transactions from "../../../../utils/transactions";
import Loader from "../../../../components/Loader";
import config from "../../../../config";
import {useTranslation} from "react-i18next";
import ModalGasAlert from "../../../Gas/ModalGasAlert";
import ModalViewTxnResponse from "../../../Common/ModalViewTxnResponse";

const ModalReDelegate = (props) => {
    const {t} = useTranslation();
    const [enteredAmount, setEnteredAmount] = useState('');
    const [amount, setAmount] = useState();
    const [initialModal, setInitialModal] = useState(true);
    const [response, setResponse] = useState('');
    const [toValidatorAddress, setToValidatorAddress] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const loginAddress = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');
    const [memoStatus, setMemoStatus] = useState(false);
    const [formData, setFormData] = useState({});
    const [feeModal, setFeeModal] = useState(false);
    const [checkAmountError, setCheckAmountError] = useState(false);

    const handleMemoChange = () => {
        setMemoStatus(!memoStatus);
    };
    const handleAmountChange = (evt) => {
        let rex = /^\d*\.?\d{0,2}$/;
        if (rex.test(evt.target.value)) {
            if (props.delegationAmount < (evt.target.value * 1)) {
                setCheckAmountError(true);
            } else {
                setCheckAmountError(false);
            }
            setEnteredAmount(evt.target.value);
            setAmount(evt.target.value * 1);
        } else {
            return false;
        }
    };
    const onChangeSelect = (evt) => {
        setToValidatorAddress(evt.target.value);
    };

    const handlePrevious = () => {
        props.setShow(true);
        props.setTxModalShow(false);
        props.setInitialModal(true);
    };

    const handleSubmitInitialData = async event => {
        event.preventDefault();
        let memo = "";
        if (memoStatus) {
            memo = event.target.memo.value;
        }
        let memoCheck = helper.mnemonicValidation(memo, loginAddress);
        if (memoCheck) {
            setErrorMessage(t("MEMO_MNEMONIC_CHECK_ERROR"));
        } else {
            setErrorMessage("");
            setInitialModal(false);
            setFeeModal(true);
            const data = {
                amount : amount,
                memo : memo,
                validatorAddress : props.validatorAddress,
                toValidatorAddress : toValidatorAddress,
                modalHeader: `Redelegate from ${props.moniker}`,
                formName: "redelegate",
                successMsg : t("SUCCESSFULL_REDELEGATED"),
                failedMsg : t("FAILED_REDELEGATE")
            };
            setFormData(data);
        }
    };

    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([RedelegateMsg(loginAddress, props.validatorAddress, toValidatorAddress, (amount * config.xprtValue).toFixed(0))], aminoMsgHelper.fee(0, 250000));
        response.then(result => {
            if (result.code !== undefined) {
                helper.accountChangeCheck(result.rawLog);
            }
            setInitialModal(false);
            setLoader(false);
            setResponse(result);
        }).catch(err => {
            setLoader(false);
            helper.accountChangeCheck(err.message);
            setErrorMessage(err.message);
        });
    };

    const selectTotalBalanceHandler = (value) =>{
        setEnteredAmount(parseFloat(( parseInt( (value * 100).toString() ) / 100 ).toFixed(2)).toString());
        setAmount(parseFloat(( parseInt( (value * 100).toString() ) / 100 ).toFixed(2)));
    };

    if (loader) {
        return <Loader/>;
    }
    const disabled = (
        helper.validateFrom(toValidatorAddress).message !== ''
    );

    const popoverMemo = (
        <Popover id="popover-memo">
            <Popover.Content>
                {t("MEMO_NOTE")}
            </Popover.Content>
        </Popover>
    );

    return (
        <>
            {initialModal ?
                <>
                    <Modal.Header closeButton>
                        <div className="previous-section txn-header">
                            <button className="button" onClick={() => handlePrevious()}>
                                <Icon
                                    viewClass="arrow-right"
                                    icon="left-arrow"/>
                            </button>
                        </div>
                        <h3 className="heading">
                            Redelegate from {props.moniker}
                        </h3>

                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                            <div className="form-field">
                                <p className="label">Validator</p>
                                <Select value={toValidatorAddress} className="validators-list-selection"
                                    onChange={onChangeSelect} displayEmpty>
                                    <MenuItem value="" key={0}>
                                        <em>{t("SELECT_VALIDATOR")}</em>
                                    </MenuItem>
                                    {
                                        props.validators.map((validator, index) => {
                                            if (validator.description.moniker !== props.moniker) {
                                                return (
                                                    <MenuItem
                                                        key={index + 1}
                                                        className=""
                                                        value={validator.operatorAddress}>
                                                        {validator.description.moniker}
                                                    </MenuItem>
                                                );
                                            }
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="form-field p-0">
                                <p className="label">{t("REDELEGATION_AMOUNT")} (XPRT)</p>
                                <div className="amount-field">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        name="amount"
                                        placeholder={t("REDELEGATION_AMOUNT")}
                                        value={enteredAmount}
                                        step="any"
                                        className={amount > props.delegationAmount ? "error-amount-field" : ""}
                                        onChange={handleAmountChange}
                                        onKeyPress={helper.inputAmountValidation}
                                        required={true}
                                    />
                                    <span
                                        className={props.delegationAmount === 0 ? "empty info-data info-link" : "info-data info-link"} onClick={()=>selectTotalBalanceHandler(props.delegationAmount)}><span
                                            className="title">{t("DELEGATED_AMOUNT")}:</span> <span
                                            className="value">{props.delegationAmount} XPRT</span> </span>
                                </div>
                            </div>
                            {mode === "normal" ?
                                <div className="memo-container">
                                    <div className="memo-dropdown-section">
                                        <p onClick={handleMemoChange} className="memo-dropdown"><span
                                            className="text">{t("ADVANCED")} </span>
                                        {memoStatus ?
                                            <Icon
                                                viewClass="arrow-right"
                                                icon="up-arrow"/>
                                            :
                                            <Icon
                                                viewClass="arrow-right"
                                                icon="down-arrow"/>}
                                        </p>
                                        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                            overlay={popoverMemo}>
                                            <button className="icon-button info" type="button"><Icon
                                                viewClass="arrow-right"
                                                icon="info"/></button>
                                        </OverlayTrigger>
                                    </div>
                                    {memoStatus ?
                                        <div className="form-field">
                                            <p className="label info">{t("MEMO")}
                                                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                                    overlay={popoverMemo}>
                                                    <button className="icon-button info" type="button"><Icon
                                                        viewClass="arrow-right"
                                                        icon="info"/></button>
                                                </OverlayTrigger></p>
                                            <Form.Control
                                                type="text"
                                                name="memo"
                                                placeholder={t("ENTER_MEMO")}
                                                maxLength={200}
                                                required={false}
                                            />
                                        </div>
                                        : ""
                                    }
                                </div> : null
                            }
                            {
                                errorMessage !== "" ?
                                    <p className="form-error">{errorMessage}</p>
                                    : null
                            }
                            <div className="buttons navigate-buttons">
                                {mode === "normal" ?
                                    <div className="button-section">
                                        <button className="button button-primary"
                                            disabled={ !props.delegateStatus || disabled || amount === 0 || checkAmountError}
                                        >{t("NEXT")}</button>
                                    </div>
                                    :
                                    <button className="button button-primary"
                                        disabled={checkAmountError || !props.delegateStatus || disabled || amount === 0}
                                    >{t("SUBMIT")}</button>
                                }
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {feeModal ?
                <ModalGasAlert
                    amountField={amount}
                    setFeeModal={setFeeModal}
                    setInitialModal={setInitialModal}
                    formData={formData}
                    handleClose={props.handleClose}
                />
                : null
            }
            {response !== '' ?
                <ModalViewTxnResponse
                    response = {response}
                    successMsg = {t("SUCCESSFULL_REDELEGATED")}
                    failedMsg =  {t("FAILED_REDELEGATE")}
                    handleClose = {props.handleClose}
                />
                : null}
        </>
    );
};

const stateToProps = (state) => {
    return {
        validators: state.validators.validators,
        balance: state.balance.amount,
        transferableAmount: state.balance.transferableAmount,
    };
};

export default connect(stateToProps)(ModalReDelegate);
