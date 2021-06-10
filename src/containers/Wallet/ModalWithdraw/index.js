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
import {WithdrawMsg} from "../../../utils/protoMsgHelper";
import {ValidatorCommissionMsg} from "../../../utils/protoMsgHelper";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import transactions from "../../../utils/transactions";
import {useTranslation} from "react-i18next";
import ModalSetWithdrawAddress from "../ModalSetWithdrawAddress";
import {fetchValidatorsWithAddress} from "../../../actions/validators";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import ModalViewValidatorRewards from "../ModalViewValidatorRewards";
import ModalGasAlert from "../../Gas/ModalGasAlert";
import ModalViewTxnResponse from "../../Common/ModalViewTxnResponse";

const ModalWithdraw = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState('');
    const [initialModal, setInitialModal] = useState(true);
    const [individualRewards, setIndividualRewards] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [withdraw, setWithDraw] = useState(false);
    const loginAddress = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');
    const [memoStatus, setMemoStatus] = useState(false);
    const [selectValidation, setSelectValidation] = useState(false);
    const [withDrawMsgs, setWithDrawMsgs] = useState({});
    const [commissionMsg, setCommissionMsg] = useState({});
    const [showRewardsModal, setShowRewardsModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [feeModal, setFeeModal] = useState(false);


    const handleMemoChange = () => {
        setMemoStatus(!memoStatus);
    };

    useEffect(() => {
        props.fetchValidatorsWithAddress(props.list, loginAddress);
    }, []);

    const handleClose = () => {
        setShow(false);
        props.setRewards(false);
    };

    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        let messages  = [];
        if(withDrawMsgs.length){
            messages = withDrawMsgs;
        }
        if(commissionMsg.length){
            messages.push(commissionMsg[0]);
        }
        const response = transactions.TransactionWithKeplr(messages, aminoMsgHelper.fee(0, 250000));
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

            let messages  = [];
            if(withDrawMsgs.length){
                messages = withDrawMsgs;
            }
            if(commissionMsg.length){
                messages.push(commissionMsg[0]);
            }
            const data = {
                memo : memo,
                modalHeader: "Claim Rewards",
                formName: "withdrawMultiple",
                messages:messages,
                successMsg : t("SUCCESSFULLY_CLAIMED"),
                failedMsg : t("FAILED_CLAIMING")
            };
            setFormData(data);
        }
        // if(mode === "normal" && (localStorage.getItem("fee") * 1) === 0 ){
        //     setFee(0);
        // }
    };

    const onChangeSelect =  (evt) => {
        let totalValidatorsRewards = 0;
        let messages = [];
        evt.forEach(async (item) => {
            totalValidatorsRewards = totalValidatorsRewards + (transactions.XprtConversion(item.rewards*1));
            messages.push(WithdrawMsg(loginAddress, item.value));
        });
        setWithDrawMsgs(messages);
        setIndividualRewards(totalValidatorsRewards);
    };

    if (loader) {
        return <Loader/>;
    }

    const handleRewards = (key) => {
        if (key === "setWithDraw") {
            setWithDraw(true);
            setShow(false);
        }
    };

    const handleViewRewards = () =>{
        setShowRewardsModal(true);
        setShow(false);
    };

    const handleCommissionChange = (evt) =>{
        let messages = [];
        if(evt.target.checked){
            messages.push(ValidatorCommissionMsg(props.validatorCommissionInfo[1]));
            setSelectValidation(true);
        }else {
            messages = [];
            setSelectValidation(false);
        }
        setCommissionMsg(messages);

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

    if (props.inProgress) {
        return <Loader/>;
    }

    const disable = (
        individualRewards === 0 && !selectValidation
    );
    return (
        <>
            <Modal
                animation={false}
                centered={true}
                backdrop="static"
                keyboard={false}
                show={show}
                className="modal-custom claim-rewards-modal"
                onHide={handleClose}>
                {initialModal ?
                    <>
                        <Modal.Header closeButton>
                            {t("CLAIM_STAKING_REWARDS")}
                        </Modal.Header>
                        <Modal.Body className="rewards-modal-body">
                            <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                                <div className="form-field">
                                    <p className="label">{t("TOTAL_AVAILABLE_BALANCE")}</p>
                                    <div className="available-tokens">
                                        <p className="tokens"
                                            title={props.totalRewards}>{props.totalRewards.toLocaleString()} XPRT</p>
                                        <p className="usd">= ${(props.totalRewards * props.tokenPrice).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="form-field rewards-validators-list">
                                    <p className="label">{t("VALIDATOR")}</p>
                                    <ReactMultiSelectCheckboxes
                                        options={props.validatorsRewardsList}
                                        onChange={onChangeSelect}
                                        placeholderButtonLabel="Select"
                                    />

                                </div>
                                <div className="form-field p-0">
                                    <p className="label"></p>
                                    <div className="available-tokens">
                                        <p className="tokens">{t("CLAIMING_REWARDS")} {individualRewards.toLocaleString()} <span>XPRT</span></p>
                                        <p className="usd">= ${(individualRewards * props.tokenPrice).toLocaleString()}</p>
                                        <p className="view" onClick={handleViewRewards}>view</p>
                                    </div>
                                </div>
                                {props.validatorCommissionInfo[2] ?
                                    <div className="form-field claim-check-box">
                                        <p className="label"></p>
                                        <div className="check-box-container">
                                            <p className="label" title={transactions.XprtConversion(props.validatorCommissionInfo[0]*1)}>{t("Claim Commission")}({transactions.XprtConversion(props.validatorCommissionInfo[0]*1).toLocaleString()} XPRT)</p>
                                            <Form.Control
                                                type="checkbox"
                                                name="claimCommission"
                                                onChange={handleCommissionChange}
                                                required={false}
                                            />
                                        </div>
                                    </div>
                                    :""
                                }
                                <div className="form-field p-0">
                                    <p className="label"></p>
                                    <div className="validator-limit-warning">
                                        <p className="amount-warning">Warning: Select below 3 validators to claim</p>
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
                                                <p className="label">{t("MEMO")}<OverlayTrigger
                                                    trigger={['hover', 'focus']}
                                                    placement="bottom"
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
                                                disabled={disable}
                                            >{t("NEXT")}</button>
                                        </div>
                                        :
                                        <button className="button button-primary"
                                            disabled={disable || individualRewards === 0}
                                        >{t("SUBMIT")}</button>
                                    }
                                </div>
                                <div className="buttons">
                                    <p className="button-link"
                                        onClick={() => handleRewards("setWithDraw")}>
                                        {t("SET_WITHDRAW_ADDRESS")}
                                        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
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
                        setShow={setInitialModal}
                        setFeeModal={setFeeModal}
                        setInitialModal={setInitialModal}
                        formData={formData}
                        handleClose={handleClose}
                    />
                    : null
                }
                {response !== '' ?
                    <ModalViewTxnResponse response = {response}/>
                    : null}
            </Modal>
            {withdraw ?
                <ModalSetWithdrawAddress setWithDraw={setWithDraw} handleClose={handleClose}
                    totalRewards={props.rewards} setShow={setShow} formName="setAddress"/>
                : null
            }
            {
                showRewardsModal ?
                    <ModalViewValidatorRewards setShowRewardsModal={setShowRewardsModal} handleClose={handleClose} setShow={setShow} formName="viewRewards"/>
                    : null
            }
        </>
    );
};

const stateToProps = (state) => {
    return {
        list: state.rewards.list,
        rewards: state.rewards.rewards,
        balance: state.balance.amount,
        tokenPrice: state.tokenPrice.tokenPrice,
        transferableAmount: state.balance.transferableAmount,
        validatorsList:state.validators.validatorsListWithAddress,
        validatorsRewardsList:state.validators.validatorsRewardsList,
        inProgress:state.validators.rewardsInProgress,
        validatorCommissionInfo:state.validators.validatorCommissionInfo
    };
};

const actionsToProps = {
    fetchValidatorsWithAddress,
};

export default connect(stateToProps, actionsToProps)(ModalWithdraw);
