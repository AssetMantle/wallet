import {
    Accordion,
    AccordionContext,
    Card,
    Form,
    Modal,
    OverlayTrigger,
    Popover,
    useAccordionToggle
} from 'react-bootstrap';
import React, {useContext, useEffect, useState} from 'react';
import success from "../../../assets/images/success.svg";
import Icon from "../../../components/Icon";
import {connect} from "react-redux";
import helper from "../../../utils/helper";
import Loader from "../../../components/Loader";
import {SetWithDrawAddressMsg} from "../../../utils/protoMsgHelper";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import transactions from "../../../utils/transactions";
import MakePersistence from "../../../utils/cosmosjsWrapper";
import {useTranslation} from "react-i18next";
import {fetchWithdrawAddress} from "../../../actions/withdrawAddress";
import FeeContainer from "../../../components/Fee";

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;

const ModalSetWithdrawAddress = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [validatorAddress, setValidatorAddress] = useState('');
    const [response, setResponse] = useState('');
    const [advanceMode, setAdvanceMode] = useState(false);
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [memoContent, setMemoContent] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const loginAddress = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');
    const [memoStatus, setMemoStatus] = useState(false);

    const handleMemoChange = () => {
        setMemoStatus(!memoStatus);
    };

    useEffect(() => {
        props.fetchWithdrawAddress(loginAddress);
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
    }, []);

    const handleClose = () => {
        setShow(false);
        props.handleClose();
        props.setWithDraw(false);
    };

    function ContextAwareToggle({eventKey, callback}) {
        const currentEventKey = useContext(AccordionContext);

        const decoratedOnClick = useAccordionToggle(
            eventKey,
            () => callback && callback(eventKey),
        );
        const handleAccordion = (event) => {
            decoratedOnClick(event);
            setAdvanceMode(!advanceMode);
        };
        const isCurrentEventKey = currentEventKey === eventKey;

        return (
            <button
                type="button"
                className="accordion-button"
                onClick={handleAccordion}
            >
                {isCurrentEventKey ?
                    <Icon
                        viewClass="arrow-right"
                        icon="up-arrow"/>
                    :
                    <Icon
                        viewClass="arrow-right"
                        icon="down-arrow"/>}

            </button>
        );
    }

    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([SetWithDrawAddressMsg(loginAddress, event.target.withdrawalAddress.value)], aminoMsgHelper.fee(5000, 250000));
        response.then(result => {
            if (result.code !== undefined) {
                helper.AccountChangeCheck(result.rawLog);
            }
            setInitialModal(false);
            setResponse(result);
            setLoader(false);
        }).catch(err => {
            setLoader(false);
            helper.AccountChangeCheck(err.message);
            setErrorMessage(err.message);
        });
    };

    const handleSubmitInitialData = async event => {
        event.preventDefault();
        let memo = "";
        if (memoStatus) {
            memo = event.target.memo.value;
        }
        let memoCheck = transactions.mnemonicValidation(memo, loginAddress);
        if (memoCheck) {
            setErrorMessage("you entered your mnemonic as memo");
        } else {
            setValidatorAddress(event.target.withdrawalAddress.value);
            setMemoContent(memo);
            setInitialModal(false);
            showSeedModal(true);
            setErrorMessage("");
        }

    };
    const handleSubmit = async event => {
        setLoader(true);
        event.preventDefault();
        let mnemonic;
        let accountNumber = 0;
        let addressIndex = 0;
        let bip39Passphrase = "";
        if (advanceMode) {
            accountNumber = event.target.claimTotalAccountNumber.value;
            addressIndex = event.target.claimTotalAccountIndex.value;
            bip39Passphrase = event.target.claimTotalbip39Passphrase.value;
        }
        if (importMnemonic) {
            const password = event.target.password.value;
            let promise = transactions.PrivateKeyReader(event.target.uploadFile.files[0], password, accountNumber, addressIndex, bip39Passphrase, loginAddress);
            await promise.then(function (result) {
                mnemonic = result;
                console.log(result);
            }).catch(err => {
                setLoader(false);
                setErrorMessage(err);
            });
        } else {
            const password = event.target.password.value;
            const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
            const res = JSON.parse(encryptedMnemonic);
            const decryptedData = helper.decryptStore(res, password);
            if (decryptedData.error != null) {
                setErrorMessage(decryptedData.error);
            } else {
                mnemonic = decryptedData.mnemonic;
                setErrorMessage("");
            }
        }
        if (mnemonic !== undefined) {
            const persistence = MakePersistence(accountNumber, addressIndex);
            const address = persistence.getAddress(mnemonic, bip39Passphrase, true);
            const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);
            if (address.error === undefined && ecpairPriv.error === undefined) {
                if (address === loginAddress) {
                    setImportMnemonic(false);
                    const response = transactions.TransactionWithMnemonic([SetWithDrawAddressMsg(address, validatorAddress)], aminoMsgHelper.fee(localStorage.getItem('fee'), 250000), memoContent,
                        mnemonic, transactions.makeHdPath(accountNumber, addressIndex), bip39Passphrase);
                    response.then(result => {
                        setResponse(result);
                        setLoader(false);
                        showSeedModal(false);
                        setAdvanceMode(false);
                    }).catch(err => {
                        setLoader(false);
                        setErrorMessage(err.message);
                    });
                    showSeedModal(false);
                } else {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage(t("ADDRESS_NOT_MATCHED_ERROR"));
                }
            } else {
                if (address.error !== undefined) {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage(address.error);
                } else {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage(ecpairPriv.error);
                }
            }
        } else {
            setLoader(false);
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

    const checkAmountError = (
        props.transferableAmount < transactions.XprtConversion(parseInt(localStorage.getItem('fee')))
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
                            Setup Rewards Withdrawal Address

                        </h3>
                    </Modal.Header>
                    <Modal.Body className="rewards-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                            <div className="form-field">
                                <p className="label">Current Address</p>
                                <Form.Control
                                    type="text"
                                    name="currentWithdrawalAddress"
                                    placeholder={t("ENTER_WITHDRAW_ADDRESS")}
                                    value={props.withdrawAddress}
                                    readOnly/>
                            </div>
                            <div className="form-field">
                                <p className="label">Revised Address</p>
                                <Form.Control
                                    type="text"
                                    name="withdrawalAddress"
                                    placeholder={t("ENTER_WITHDRAW_ADDRESS")}
                                    required={true}
                                />
                            </div>
                            <div className="form-field">
                                <p className="label"> Delegations (XPRT)</p>
                                <p className={props.delegations === 0 ? "empty info-data" : "info-data"}>{props.delegations}</p>
                            </div>
                            {mode === "normal" ?
                                <>
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
                                </> : null
                            }
                            {
                                errorMessage !== "" ?
                                    <p className="form-error">{errorMessage}</p>
                                    : null
                            }
                            <div className="buttons">
                                <FeeContainer/>
                                <button className="button button-primary" disabled={checkAmountError || !props.status}
                                >{mode === "normal" ? "Next" : "Submit"}</button>
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {seedModal ?
                <>
                    <Modal.Header closeButton>
                        Setup Rewards Withdrawal Address
                    </Modal.Header>
                    <Modal.Body className="rewards-modal-body">
                        <Form onSubmit={handleSubmit}>
                            {
                                importMnemonic ?
                                    <>
                                        <div className="form-field upload">
                                            <p className="label"> KeyStore file</p>
                                            <Form.File id="exampleFormControlFile1" name="uploadFile"
                                                className="file-upload" accept=".json" required={true}/>
                                        </div>
                                        <div className="form-field">
                                            <p className="label">{t("PASSWORD")}</p>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder={t("ENTER_PASSWORD")}
                                                required={true}
                                            />
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="form-field">
                                            <p className="label">{t("KEY_STORE_PASSWORD")}</p>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder={t("ENTER_PASSWORD")}
                                                required={true}
                                            />
                                        </div>
                                    </>

                            }
                            <Accordion className="advanced-wallet-accordion">
                                <Card>
                                    <Card.Header>
                                        <p>
                                            {t("ADVANCED")}
                                        </p>
                                        <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <>
                                            <div className="form-field">
                                                <p className="label">{t("ACCOUNT")}</p>
                                                <Form.Control
                                                    type="text"
                                                    name="claimTotalAccountNumber"
                                                    id="claimTotalAccountNumber"
                                                    placeholder={t("ACCOUNT_NUMBER")}
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("ACCOUNT_INDEX")}</p>
                                                <Form.Control
                                                    type="text"
                                                    name="claimTotalAccountIndex"
                                                    id="claimTotalAccountIndex"
                                                    placeholder={t("ACCOUNT_INDEX")}
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("BIP_PASSPHRASE")}</p>
                                                <Form.Control
                                                    type="password"
                                                    name="claimTotalbip39Passphrase"
                                                    id="claimTotalbip39Passphrase"
                                                    placeholder={t("ENTER_BIP_PASSPHRASE")}
                                                    required={false}
                                                />
                                            </div>
                                        </>
                                    </Accordion.Collapse>
                                    {
                                        errorMessage !== "" ?
                                            <p className="form-error">{errorMessage}</p>
                                            : null
                                    }
                                </Card>
                            </Accordion>
                            <div className="buttons">
                                <button className="button button-primary">{t("CLAIM_REWARDS")}</button>
                            </div>
                        </Form>
                    </Modal.Body>

                </>
                : null
            }
            {
                response !== '' && response.code === 0 ?
                    <>
                        <Modal.Header className="result-header success" closeButton>
                            {t("SUCCESSFULLY_ADDRESS_CHANGED")}
                        </Modal.Header>
                        <Modal.Body className="delegate-modal-body">
                            <div className="result-container">
                                <img src={success} alt="success-image"/>
                                {mode === "kepler" ?
                                    <a
                                        href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                        target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                        Hash: {response.transactionHash}</a>
                                    :
                                    <a
                                        href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                        target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                        Hash: {response.transactionHash}</a>
                                }
                                <div className="buttons">
                                    <button className="button" onClick={handleClose}>{t("DONE")}</button>
                                </div>
                            </div>
                        </Modal.Body>
                    </>
                    : null
            }
            {
                response !== '' && response.code !== 0 ?
                    <>
                        <Modal.Header className="result-header error" closeButton>
                            {t("FAILED_ADDRESS_CHANGE")}
                        </Modal.Header>
                        <Modal.Body className="delegate-modal-body">
                            <div className="result-container">
                                {mode === "kepler" ?
                                    <>
                                        <p>{response.rawLog}</p>
                                        <a
                                            href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                            target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                            Hash: {response.transactionHash}</a>
                                    </>
                                    :
                                    <>
                                        <p>{response.rawLog === "panic message redacted to hide potentially sensitive system info: panic" ? "You cannot send vesting amount" : response.rawLog}</p>
                                        <a
                                            href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                            target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                            Hash: {response.transactionHash}</a>
                                    </>
                                }
                                <div className="buttons">
                                    <button className="button" onClick={handleClose}> {t("DONE")}</button>
                                </div>
                            </div>
                        </Modal.Body>
                    </>
                    : null
            }
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
