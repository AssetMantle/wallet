import {
    Accordion,
    AccordionContext,
    Card,
    Form,
    Modal,
    Popover,
    useAccordionToggle,
    OverlayTrigger,
} from 'react-bootstrap';
import React, {useContext, useEffect, useState} from 'react';
import success from "../../../../assets/images/success.svg";
import Icon from "../../../../components/Icon";
import {connect} from "react-redux";
import transactions from "../../../../utils/transactions";
import aminoMsgHelper from "../../../../utils/aminoMsgHelper";
import {UnbondMsg} from "../../../../utils/protoMsgHelper";
import helper from "../../../../utils/helper";
import Loader from "../../../../components/Loader";
import config from "../../../../config";
import MakePersistence from "../../../../utils/cosmosjsWrapper";
import {useTranslation} from "react-i18next";
import GasContainer from "../../../../components/Gas";

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;
const ModalUnbond = (props) => {
    const {t} = useTranslation();
    const [amount, setAmount] = useState(0);
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
    const [checkAmountError, setCheckAmountError] = useState(false);
    const [showGasField, setShowGasField] = useState(false);
    const [activeFeeState, setActiveFeeState] = useState("Average");
    const [gas, setGas] = useState(config.gas);
    const [gasValidationError, setGasValidationError] = useState(false);
    const [fee, setFee] = useState(config.averageFee);


    const handleMemoChange = () => {
        setMemoStatus(!memoStatus);
    };

    const handleAmountChange = (evt) => {
        let rex = /^\d*\.?\d{0,2}$/;
        if (rex.test(evt.target.value)) {
            if (props.transferableAmount < transactions.XprtConversion(fee)) {
                setCheckAmountError(true);
            } else {
                setCheckAmountError(false);
            }
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

    function ContextAwareToggle({ eventKey, callback}) {
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
        setFee(gas*fee);
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
    }, []);


    const handleSubmitInitialData = async event => {
        event.preventDefault();
        let memo = "";
        if (memoStatus) {
            memo = event.target.memo.value;
        }
        let memoCheck = transactions.mnemonicValidation(memo, loginAddress);
        if (memoCheck) {
            setErrorMessage(t("MEMO_MNEMONIC_CHECK_ERROR"));
        } else {
            setErrorMessage("");
            setMemoContent(memo);
            setInitialModal(false);
            showSeedModal(true);
        }
        if(mode === "normal" && (localStorage.getItem("fee") * 1) === 0 ){
            setFee(0);
        }
    };
    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([UnbondMsg(loginAddress, props.validatorAddress, (amount * config.xprtValue))], aminoMsgHelper.fee(0, 250000));
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
    const handleSubmit = async event => {
        setLoader(true);
        event.preventDefault();
        let mnemonic;
        let accountNumber = 0;
        let addressIndex = 0;
        let bip39Passphrase = "";
        if (advanceMode) {
            accountNumber = event.target.unbondAccountNumber.value;
            addressIndex = event.target.unbondAccountIndex.value;
            bip39Passphrase = event.target.unbondbip39Passphrase.value;
        }
        if (importMnemonic) {
            const password = event.target.password.value;
            let promise = transactions.PrivateKeyReader(event.target.uploadFile.files[0], password, accountNumber, addressIndex, bip39Passphrase, loginAddress);
            await promise.then(function (result) {
                mnemonic = result;
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
                    const response = transactions.TransactionWithMnemonic([UnbondMsg(address, props.validatorAddress, (amount * config.xprtValue))], aminoMsgHelper.fee(Math.trunc(fee), gas), memoContent,
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

    const handleGas = () =>{
        setShowGasField(!showGasField);
    };

    const handleGasChange = (event) =>{
        if((event.target.value * 1) >= 80000 && (event.target.value * 1) <= 2000000) {
            setGasValidationError(false);
            setGas(event.target.value * 1);
            if ((localStorage.getItem("fee") * 1) !== 0) {
                if (activeFeeState === "Average") {
                    setFee((event.target.value * 1) * config.averageFee);
                } else if (activeFeeState === "High") {
                    setFee((event.target.value * 1) * config.highFee);
                } else if (activeFeeState === "Low") {
                    setFee((event.target.value * 1) * config.lowFee);
                }

                if (activeFeeState === "Average" && (transactions.XprtConversion((event.target.value * 1) * config.averageFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "High" && (transactions.XprtConversion((event.target.value * 1) * config.highFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "Low" && (transactions.XprtConversion((event.target.value * 1) * config.lowFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else {
                    setCheckAmountError(false);
                }
            }
        }else {
            setGasValidationError(true);
        }
    };

    const handleFee = (feeType, feeValue)=>{
        setActiveFeeState(feeType);
        setFee(gas*feeValue);
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
                                <p className="label">Amount (XPRT)</p>
                                <div className="amount-field">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        name="amount"
                                        placeholder={t("UNBOND_AMOUNT")}
                                        value={amount}
                                        step="any"
                                        className={amount > props.delegationAmount ? "error-amount-field" : ""}
                                        onChange={handleAmountChange}
                                        required={true}
                                    />
                                    <span className={props.delegationAmount === 0 ? "empty info-data" : "info-data"}><span
                                        className="title">{t("DELEGATED_AMOUNT")}:</span> <span
                                        className="value">{props.delegationAmount} XPRT</span> </span>
                                </div>
                            </div>
                            {mode === "normal" ?
                                <>
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
                                </>
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
                                        <GasContainer checkAmountError={checkAmountError} activeFeeState={activeFeeState} onClick={handleFee} gas={gas}/>
                                        <div className="select-gas">
                                            <p onClick={handleGas}>{!showGasField ? "Set gas" : "Close"}</p>
                                        </div>
                                        {showGasField
                                            ?
                                            <div className="form-field">
                                                <p className="label info">{t("GAS")}</p>
                                                <div className="amount-field">
                                                    <Form.Control
                                                        type="number"
                                                        min={80000}
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
                                                                Enter Gas between 80000 to 2000000
                                                            </span> : ""
                                                    }
                                                </div>
                                            </div>
                                            : ""
                                        }
                                        <button className="button button-primary"
                                            disabled={checkAmountError || !props.delegateStatus || amount === 0 || amount > props.delegationAmount || gasValidationError}
                                        >Next</button>
                                    </div>
                                    :
                                    <button className="button button-primary"
                                        disabled={checkAmountError || !props.delegateStatus || amount === 0 || amount > props.delegationAmount}
                                    >Submit</button>
                                }
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {seedModal ?
                <>
                    <Modal.Header closeButton>
                        Unbond from {props.moniker}
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
                                            ({t("ADVANCED")})
                                        </p>
                                        <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <>
                                            <div className="form-field">
                                                <p className="label">{t("ACCOUNT")}</p>
                                                <Form.Control
                                                    type="text"
                                                    name="unbondAccountNumber"
                                                    id="unbondAccountNumber"
                                                    placeholder={t("ACCOUNT_NUMBER")}
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("ACCOUNT_INDEX")}</p>
                                                <Form.Control
                                                    type="text"
                                                    name="unbondAccountIndex"
                                                    id="unbondAccountIndex"
                                                    placeholder={t("ACCOUNT_INDEX")}
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("BIP_PASSPHRASE")}</p>
                                                <Form.Control
                                                    type="password"
                                                    name="unbondbip39Passphrase"
                                                    id="unbondbip39Passphrase"
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
                                <button className="button button-primary">Unbond</button>
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
                            {t("SUCCESSFULL_UNBOND")}
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
                                    <button className="button" onClick={props.handleClose}>{t("DONE")}</button>
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
                            {t("FAILED_UNBOND")}
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
                                    <button className="button" onClick={props.handleClose}> {t("DONE")}</button>
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

export default connect(stateToProps)(ModalUnbond);
