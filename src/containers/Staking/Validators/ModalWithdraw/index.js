import {
    Form,
    Modal,
    OverlayTrigger,
    Popover,
} from 'react-bootstrap';
import React, {useState} from 'react';
import Icon from "../../../../components/Icon";
import aminoMsgHelper from "../../../../utils/aminoMsgHelper";
import {WithdrawMsg} from "../../../../utils/protoMsgHelper";
import transactions from "../../../../utils/transactions";
import helper from "../../../../utils/helper";
import Loader from "../../../../components/Loader";
import {useTranslation} from "react-i18next";
import {connect} from "react-redux";
import ModalGasAlert from "../../../Gas/ModalGasAlert";
import ModalViewTxnResponse from "../../../Common/ModalViewTxnResponse";

const ModalWithdraw = (props) => {
    const {t} = useTranslation();
    const [response, setResponse] = useState('');
    const [initialModal, setInitialModal] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const loginAddress = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');
    const [memoStatus, setMemoStatus] = useState(false);
    const [formData, setFormData] = useState({});
    const [feeModal, setFeeModal] = useState(false);

    const handleMemoChange = () => {
        setMemoStatus(!memoStatus);
    };

    const handlePrevious = () => {
        props.setShow(true);
        props.setTxModalShow(false);
        props.setInitialModal(true);
    };

    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([WithdrawMsg(loginAddress, props.validatorAddress)], aminoMsgHelper.fee(0, 250000));
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
                memo : memo,
                validatorAddress : props.validatorAddress,
                modalHeader: t("CLAIM_STAKING_REWARDS"),
                formName: "withdrawValidatorRewards",
                successMsg : t("SUCCESSFULLY_CLAIMED"),
                failedMsg : t("FAILED_CLAIMING")
            };
            setFormData(data);
        }
    };

    if (loader) {
        return <Loader/>;
    }

    const handleRewards = (key) => {
        if (key === "setWithDraw") {
            props.handleRewards();
        }
    };
    const popoverMemo = (
        <Popover id="popover-memo">
            <Popover.Content>
                {t("MEMO_NOTE")}
            </Popover.Content>
        </Popover>
    );
    const popoverSetupAddress = (
        <Popover id="popover-memo">
            <Popover.Content>
                {t("SETUP_ADDRESS_NOTE")}
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
                            {t("CLAIM_STAKING_REWARDS")}
                        </h3>
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                            <div className="form-field p-0">
                                <p className="label">{t("AVAILABLE")} (XPRT)</p>
                                <div className="available-tokens">
                                    <p className={props.rewards === 0 ? "empty info-data" : "info-data"} title={props.rewards}>{props.rewards.toLocaleString()}</p>
                                </div>
                            </div>
                            {
                                mode === "normal" ?
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
                                            disabled={props.rewards === 0}
                                        >{t("NEXT")}</button>
                                    </div>
                                    :
                                    <button className="button button-primary"
                                        disabled={props.rewards === 0}
                                    >{t("SUBMIT")}</button>
                                }
                            </div>
                            <div className="buttons">
                                <p className="button-link" type="button"
                                    onClick={() => handleRewards("setWithDraw")}>
                                    {t("SET_WITHDRAW_ADDRESS")}
                                    <OverlayTrigger trigger={['hover', 'focus']}
                                        placement="bottom"
                                        overlay={popoverSetupAddress}>
                                        <button className="icon-button info" type="button"><Icon
                                            viewClass="arrow-right"
                                            icon="info"/></button>
                                    </OverlayTrigger>
                                </p>
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {feeModal ?
                <ModalGasAlert
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
                    successMsg = {t("SUCCESSFULLY_CLAIMED")}
                    failedMsg =  {t("FAILED_CLAIMING")}
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
export default connect(stateToProps)(ModalWithdraw);
