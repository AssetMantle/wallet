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
import success from "../../../../assets/images/success.svg";
import Icon from "../../../../components/Icon";
import aminoMsgHelper from "../../../../utils/aminoMsgHelper";
import {WithdrawMsg} from "../../../../utils/protoMsgHelper";
import transactions from "../../../../utils/transactions";
import helper from "../../../../utils/helper";
import Loader from "../../../../components/Loader";
import MakePersistence from "../../../../utils/cosmosjsWrapper";
import config from "../../../../config";
import {useTranslation} from "react-i18next";
import {connect} from "react-redux";
import FeeContainer from "../../../../components/Fee";
const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;
const ModalWithdraw = (props) => {
    const {t} = useTranslation();
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
    const handleClose = () => {
        props.setModalOpen('');
        props.setTxModalShow(false);
        props.setInitialModal(true);
        setResponse('');
    };
    const handlePrevious = () => {
        props.setShow(true);
        props.setTxModalShow(false);
        props.setInitialModal(true);
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

    useEffect(() => {
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false)
        } else {
            setImportMnemonic(true);
        }
    }, []);

    function PrivateKeyReader(file, password) {
        return new Promise(function (resolve) {
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = event => {
                const res = JSON.parse(event.target.result);
                localStorage.setItem('encryptedMnemonic', event.target.result);
                const decryptedData = helper.decryptStore(res, password);
                if (decryptedData.error != null) {
                    setErrorMessage(decryptedData.error)
                    setLoader(false);
                } else {
                    resolve(decryptedData.mnemonic);
                    setErrorMessage("");
                }
            };
        });
    }

    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([WithdrawMsg(loginAddress, props.validatorAddress)], aminoMsgHelper.fee(0, 250000));
        response.then(result => {
            if (result.code !== undefined) {
                helper.AccountChangeCheck(result.rawLog)
            }
            setInitialModal(false);
            setResponse(result);
            setLoader(false)
        }).catch(err => {
            setLoader(false);
            helper.AccountChangeCheck(err.message);
            setErrorMessage(err.message);
        })
    };

    const handleSubmitInitialData = async event => {
        event.preventDefault();
        let memo = "";
        if (memoStatus) {
            memo = event.target.memo.value;
        }
        let memoCheck = transactions.mnemonicValidation(memo, loginAddress)
        if (memoCheck) {
            setErrorMessage("you entered your mnemonic as memo")
        } else {
            setErrorMessage("");
            setMemoContent(memo);
            setInitialModal(false);
            showSeedModal(true);
        }
    };

    const handleSubmit = async event => {
        setLoader(true);
        event.preventDefault();
        let mnemonic;
        if (importMnemonic) {
            const password = event.target.password.value;
            var promise = PrivateKeyReader(event.target.uploadFile.files[0], password);
            await promise.then(function (result) {
                mnemonic = result;
            });
        } else {
            const password = event.target.password.value;
            const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
            const res = JSON.parse(encryptedMnemonic);
            const decryptedData = helper.decryptStore(res, password);
            if (decryptedData.error != null) {
                setErrorMessage(decryptedData.error)
            } else {
                mnemonic = decryptedData.mnemonic;
                setErrorMessage("");
            }
        }
        if (mnemonic !== undefined) {
            let accountNumber = 0;
            let addressIndex = 0;
            let bip39Passphrase = "";
            if (advanceMode) {
                accountNumber = event.target.claimAccountNumber.value;
                addressIndex = event.target.claimAccountIndex.value;
                bip39Passphrase = event.target.claimbip39Passphrase.value;
            }
            const persistence = MakePersistence(accountNumber, addressIndex);
            const address = persistence.getAddress(mnemonic, bip39Passphrase, true);
            const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);
            if (address.error === undefined && ecpairPriv.error === undefined) {
                if (address === loginAddress) {
                    setImportMnemonic(false);
                    persistence.getAccounts(address).then(data => {
                        if (data.code === undefined) {
                            let [accountNumber, sequence] = transactions.getAccountNumberAndSequence(data);
                            let stdSignMsg = persistence.newStdMsg({
                                msgs: aminoMsgHelper.msgs(aminoMsgHelper.withDrawMsg(address, props.validatorAddress)),
                                chain_id: persistence.chainId,
                                fee: aminoMsgHelper.fee(localStorage.getItem('fee'), 250000),
                                memo: memoContent,
                                account_number: String(accountNumber),
                                sequence: String(sequence)
                            });
                            const signedTx = persistence.sign(stdSignMsg, ecpairPriv, config.modeType);
                            persistence.broadcast(signedTx).then(response => {
                                setResponse(response);
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
                            setErrorMessage(data.message);
                        }
                    }).catch(err => {
                        setLoader(false);
                        setAdvanceMode(false);
                        setErrorMessage(err.message);
                    })
                } else {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage("Mnemonic not matched")
                }
            } else {
                if (address.error !== undefined) {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage(address.error)
                } else {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage(ecpairPriv.error)
                }
            }
        } else {
            setLoader(false);
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

    const checkAmountError = (
        props.transferableAmount < (parseInt(localStorage.getItem('fee')) / 1000000)
    );
    return (
        <>
            {initialModal ?
                <>
                    <Modal.Header closeButton>
                        {t("CLAIM_STAKING_REWARDS")}
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                            <div className="form-field">
                                <p className="label">{t("AVAILABLE")} (XPRT)</p>
                                <div className="available-tokens">
                                    <p className={props.rewards === 0 ? "empty info-data" : "info-data"}>{props.rewards}</p>
                                </div>
                            </div>
                            {
                                mode === "normal" ?
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
                                                    required={false}
                                                />
                                            </div>
                                            : ""
                                        }
                                    </>
                                    : null
                            }
                            {
                                errorMessage !== "" ?
                                    <p className="form-error">{errorMessage}</p>
                                    : null
                            }
                            <div className="buttons navigate-buttons">
                                <FeeContainer/>
                                <button className="button button-secondary" onClick={() => handlePrevious()}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                                <button
                                    className={props.rewards ? "button button-primary" : "button button-primary disabled"}
                                    disabled={checkAmountError || props.rewards === 0}> {mode === "normal" ? t("NEXT") : t("SUBMIT")}
                                </button>
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
            {seedModal ?
                <>
                    <Modal.Header closeButton>
                        {t("CLAIM_STAKING_REWARDS")}
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
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
                                            <div className="amount-field">
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder={t("ENTER_PASSWORD")}
                                                    required={true}
                                                />
                                                <span className={props.balance === 0 ? "empty info-data" : "info-data"}><span
                                                    className="title">Available Balance:</span> <span
                                                    className="value">{props.balance} XPRT</span> </span>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="form-field">
                                            <p className="label">{t("PASSWORD")}</p>
                                            <div className="amount-field">
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder={t("ENTER_PASSWORD")}
                                                    required={true}
                                                />
                                                <span
                                                    className={props.balance === 0 ? "empty info-data" : "info-data"}><span
                                                    className="title">Available Balance:</span> <span
                                                    className="value">{props.balance} XPRT</span> </span>
                                            </div>
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
                                                    name="claimAccountNumber"
                                                    id="claimAccountNumber"
                                                    placeholder={t("ACCOUNT_NUMBER")}
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("ACCOUNT_INDEX")}</p>
                                                <Form.Control
                                                    type="text"
                                                    name="claimAccountIndex"
                                                    id="claimAccountIndex"
                                                    placeholder={t("ACCOUNT_INDEX")}
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("BIP_PASSPHRASE")}</p>
                                                <Form.Control
                                                    type="password"
                                                    name="claimbip39Passphrase"
                                                    id="claimbip39Passphrase"
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
                                <button className="button button-primary" disabled={props.balance < 0.005}>Claim
                                    Rewards
                                </button>
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {
                response !== '' && response.code === undefined ?
                    <>
                        <Modal.Header className="result-header success" closeButton>
                            {t("SUCCESSFULLY_CLAIMED")}
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
                                        href={`${EXPLORER_API}/transaction?txHash=${response.txhash}`}
                                        target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                        Hash: {response.txhash}</a>
                                }
                                <div className="buttons">
                                    <button className="button"
                                            onClick={props.handleClose}>{t("DONE")}</button>
                                </div>
                            </div>
                        </Modal.Body>
                    </>
                    : null
            }
            {
                response !== '' && response.code !== undefined ?
                    <>
                        <Modal.Header className="result-header error" closeButton>
                            {t("FAILED_CLAIMING")}
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
                                        <p>{response.raw_log === "panic message redacted to hide potentially sensitive system info: panic" ? "You cannot send vesting amount" : response.raw_log}</p>
                                        <a
                                            href={`${EXPLORER_API}/transaction?txHash=${response.txhash}`}
                                            target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                            Hash: {response.txhash}</a>
                                    </>
                                }
                                <div className="buttons">
                                    <button className="button"
                                            onClick={handleClose}> {t("DONE")}</button>
                                </div>
                            </div>
                        </Modal.Body>
                    </>
                    : null
            }

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