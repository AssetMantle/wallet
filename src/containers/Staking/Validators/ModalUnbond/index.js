import {
    Form,
    Modal,
    Popover,
    OverlayTrigger,
} from 'react-bootstrap';
import React, {useState} from 'react';
import Icon from "../../../../components/Icon";
import {connect} from "react-redux";
import transactions from "../../../../utils/transactions";
import aminoMsgHelper from "../../../../utils/aminoMsgHelper";
import {UnbondMsg} from "../../../../utils/protoMsgHelper";
import helper from "../../../../utils/helper";
import Loader from "../../../../components/Loader";
import config from "../../../../config";
import {useTranslation} from "react-i18next";
import ModalGasAlert from "../../../Gas/ModalGasAlert";
import ModalViewTxnResponse from "../../../Common/ModalViewTxnResponse";

const ModalUnbond = (props) => {
    const {t} = useTranslation();
    const [amount, setAmount] = useState();
    const [enteredAmount, setEnteredAmount] = useState('');
    const [response, setResponse] = useState('');
    const [initialModal, setInitialModal] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const loginAddress = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');
    const [memoStatus, setMemoStatus] = useState(false);
    const [checkAmountError, setCheckAmountError] = useState(false);
    const [formData, setFormData] = useState({});
    const [feeModal, setFeeModal] = useState(false);

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
                modalHeader: `Unbond from ${props.moniker}`,
                formName: "unbond",
                successMsg : t("SUCCESSFULL_UNBOND"),
                failedMsg : t("FAILED_UNBOND")
            };
            setFormData(data);
        }
    };
    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([UnbondMsg(loginAddress, props.validatorAddress, (amount * config.xprtValue).toFixed(0))], aminoMsgHelper.fee(0, 250000));
        response.then(result => {
            if (result.code !== undefined) {
                helper.accountChangeCheck(result.rawLog);
            }
            setInitialModal(false);
            setResponse(result);
            setLoader(false);
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
                            Unbond from {props.moniker}
                        </h3>
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                            <div className="form-field p-0">
                                <p className="label">{t("AMOUNT")} (XPRT)</p>
                                <div className="amount-field">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        name="amount"
                                        placeholder={t("UNBOND_AMOUNT")}
                                        value={enteredAmount}
                                        step="any"
                                        className={amount > props.delegationAmount ? "error-amount-field" : ""}
                                        onChange={handleAmountChange}
                                        onKeyPress={helper.inputAmountValidation}
                                        required={true}
                                    />
                                    <span className={props.delegationAmount === 0 ? "empty info-data info-link" : "info-data info-link"} onClick={()=>selectTotalBalanceHandler(props.delegationAmount)}><span
                                        className="title">{t("DELEGATED_AMOUNT")}:</span> <span
                                        className="value">{props.delegationAmount} XPRT</span> </span>
                                </div>
                            </div>
                            {mode === "normal" ?
                                <div className="memo-container">
                                    <div className="memo-dropdown-section">
                                        <p onClick={handleMemoChange} className="memo-dropdown"><span className="text">{t("ADVANCED")} </span>
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
                                </div>
                                : null
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
                                            disabled={checkAmountError || !props.delegateStatus || amount === 0 || amount > props.delegationAmount}
                                        >{t("NEXT")}</button>
                                    </div>
                                    :
                                    <button className="button button-primary"
                                        disabled={checkAmountError || !props.delegateStatus || amount === 0 || amount > props.delegationAmount}
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
                    successMsg = {t("SUCCESSFULL_UNBOND")}
                    failedMsg =  {t("FAILED_UNBOND")}
                    handleClose = {props.handleClose}
                />
                : null}
        </>
    );
};

const stateToProps = (state) => {
    return {
        balance: state.balance.amount,
        transferableAmount: state.balance.transferableAmount,
    };
};

export default connect(stateToProps)(ModalUnbond);
