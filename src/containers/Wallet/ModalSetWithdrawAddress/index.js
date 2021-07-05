import {
    Form,
    Modal,
    OverlayTrigger,
    Popover,
} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import Icon from "../../../components/Icon";
import {connect} from "react-redux";
import helper from "../../../utils/helper";
import Loader from "../../../components/Loader";
import {SetWithDrawAddressMsg} from "../../../utils/protoMsgHelper";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import transactions from "../../../utils/transactions";
import {useTranslation} from "react-i18next";
import {fetchWithdrawAddress} from "../../../actions/withdrawAddress";
import ModalGasAlert from "../../Gas/ModalGasAlert";
import ModalViewTxnResponse from "../../Common/ModalViewTxnResponse";

const ModalSetWithdrawAddress = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
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

    useEffect(() => {
        props.fetchWithdrawAddress(loginAddress);
    }, []);

    const handleClose = () => {
        setShow(false);
        props.handleClose();
        props.setWithDraw(false);
    };


    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([SetWithDrawAddressMsg(loginAddress, event.target.withdrawalAddress.value)], aminoMsgHelper.fee(0, 250000));
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
            if (helper.validateAddress(event.target.withdrawalAddress.value)) {
                setInitialModal(false);
                setFeeModal(true);
                setErrorMessage("");
                const data = {
                    memo : memo,
                    modalHeader: t("SETUP_WITHDRAWAL_ADDRESS"),
                    formName: "withdrawAddress",
                    validatorAddress:event.target.withdrawalAddress.value,
                    successMsg : t("SUCCESSFULLY_ADDRESS_CHANGED"),
                    failedMsg : t("FAILED_ADDRESS_CHANGE")
                };
                setFormData(data);
            }else {
                setErrorMessage("Enter Valid Revised Address");
            }

        }
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

    const handlePrevious = () => {
        if(props.formName === "setAddress"){
            props.setShow(true);
            props.setWithDraw(false);
            setShow(false);
        }
    };

    return (
        <Modal
            animation={false}
            centered={true}
            keyboard={false}
            backdrop="static"
            show={show}
            className="modal-custom claim-rewards-modal"
            onHide={handleClose}>
            {initialModal ?
                <>
                    <Modal.Header closeButton>
                        {(props.formName === "setAddress") ?
                            <div className="previous-section txn-header">
                                <button className="button" onClick={() => handlePrevious()}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                            </div>
                            :""
                        }
                        <h3 className="heading">
                            {t("SETUP_WITHDRAWAL_ADDRESS")}
                        </h3>
                    </Modal.Header>
                    <Modal.Body className="rewards-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                            <div className="form-field">
                                <p className="label">{t("CURRENT_ADDRESS")}</p>
                                <Form.Control
                                    type="text"
                                    onKeyPress={helper.inputSpaceValidation}
                                    name="currentWithdrawalAddress"
                                    placeholder={t("ENTER_CURRENT_ADDRESS")}
                                    value={props.withdrawAddress}
                                    readOnly/>
                            </div>
                            <div className="form-field">
                                <p className="label">{t("REVISED_ADDRESS")}</p>
                                <Form.Control
                                    type="text"
                                    onKeyPress={helper.inputSpaceValidation}
                                    name="withdrawalAddress"
                                    placeholder={t("ENTER_WITHDRAW_ADDRESS")}
                                    required={true}
                                />
                            </div>
                            <div className="form-field p-0">
                                <p className="label"> {t("DELEGATIONS")} (XPRT)</p>
                                <p className={props.delegations === 0 ? "empty info-data" : "info-data"}>{props.delegations}</p>
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
                                        <OverlayTrigger trigger={['hover', 'focus']}
                                            placement="bottom"
                                            overlay={popoverMemo}>
                                            <button className="icon-button info" type="button"><Icon
                                                viewClass="arrow-right"
                                                icon="info"/></button>
                                        </OverlayTrigger>
                                    </div>
                                    {memoStatus ?
                                        <div className="form-field">
                                            <p className="label">{t("MEMO")}
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
                                        </div> : ""
                                    }
                                </div> : null
                            }
                            {
                                errorMessage !== "" ?
                                    <p className="form-error">{errorMessage}</p>
                                    : null
                            }
                            <div className="buttons">
                                {mode === "normal" ?
                                    <div className="button-section">
                                        <button className="button button-primary"
                                            disabled={!props.status}
                                        > {t("NEXT")}</button>
                                    </div>
                                    :
                                    <button className="button button-primary"
                                        disabled={!props.status}
                                    > {t("SUBMIT")}</button>
                                }
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {feeModal ?
                <ModalGasAlert
                    setShow={setInitialModal}
                    setFeeModal={setFeeModal}
                    setInitialModal={setInitialModal}
                    formData={formData}
                    handleClose={handleClose}
                />
                : null
            }
            {response !== '' ?
                <ModalViewTxnResponse
                    response = {response}
                    successMsg = {t("SUCCESSFULLY_ADDRESS_CHANGED")}
                    failedMsg =  {t("FAILED_ADDRESS_CHANGE")}
                    handleClose = {handleClose}
                />
                : null}
        </Modal>
    );
};

const stateToProps = (state) => {
    return {
        list: state.rewards.list,
        tokenPrice: state.tokenPrice.tokenPrice,
        status: state.delegations.status,
        delegations: state.delegations.count,
        withdrawAddress: state.withdrawAddress.withdrawAddress,
        transferableAmount: state.balance.transferableAmount,
    };
};

const actionsToProps = {
    fetchWithdrawAddress
};

export default connect(stateToProps, actionsToProps)(ModalSetWithdrawAddress);
