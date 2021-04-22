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
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import helper from "../../../../utils/helper";
import aminoMsgHelper from "../../../../utils/aminoMsgHelper";
import {RedelegateMsg} from "../../../../utils/protoMsgHelper";
import {connect} from "react-redux";
import transactions from "../../../../utils/transactions";
import Loader from "../../../../components/Loader";
import MakePersistence from "../../../../utils/cosmosjsWrapper";
import config from "../../../../config";
import {useTranslation} from "react-i18next";
import FeeContainer from "../../../../components/Fee";

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;
const ModalReDelegate = (props) => {
    const {t} = useTranslation();
    const [amount, setAmount] = useState(0);
    const [memoContent, setMemoContent] = useState('');
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [response, setResponse] = useState('');
    const [toValidatorAddress, setToValidatorAddress] = useState("");
    const [advanceMode, setAdvanceMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [loader, setLoader] = useState(false);
    const loginAddress = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');
    const [memoStatus, setMemoStatus] = useState(false);

    const handleMemoChange = () => {
        setMemoStatus(!memoStatus);
    };
    const handleAmountChange = (evt) => {
        let rex = /^\d*\.?\d{0,2}$/;
        if (rex.test(evt.target.value)) {
            setAmount(evt.target.value*1);
        } else {
            return false;
        }
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
            setImportMnemonic(false);
        }else{
            setImportMnemonic(true);
        }
    }, []);
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
        let memoCheck = transactions.mnemonicValidation(memo, loginAddress);
        if (memoCheck) {
            setErrorMessage("you entered your mnemonic as memo");
        } else {
            setErrorMessage("");
            setMemoContent(memo);
            setInitialModal(false);
            showSeedModal(true);
        }
    };

    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([RedelegateMsg(loginAddress, props.validatorAddress, toValidatorAddress, (amount * 1000000))], aminoMsgHelper.fee(0, 250000));
        response.then(result => {
            if(result.code !== undefined){
                helper.AccountChangeCheck(result.rawLog);
            }
            setInitialModal(false);
            setLoader(false);
            setResponse(result);
        }).catch(err => {
            setLoader(false);
            helper.AccountChangeCheck(err.message);
            setErrorMessage(err.message);
        });
    };

    function PrivateKeyReader(file, password) {
        return new Promise(function (resolve) {
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = event => {
                const res = JSON.parse(event.target.result);
                localStorage.setItem('encryptedMnemonic', event.target.result);
                const decryptedData = helper.decryptStore(res, password);
                if (decryptedData.error != null) {
                    setErrorMessage(decryptedData.error);
                    setLoader(false);
                } else {
                    resolve(decryptedData.mnemonic);
                    setErrorMessage("");
                }
            };
        });
    }

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
                setErrorMessage(decryptedData.error);
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
                accountNumber = event.target.redelegateAccountNumber.value;
                addressIndex = event.target.redelegateAccountIndex.value;
                bip39Passphrase = event.target.redelegatebip39Passphrase.value;
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
                                msgs: aminoMsgHelper.msgs(aminoMsgHelper.reDelegateMsg((amount * 1000000), address, props.validatorAddress, toValidatorAddress)),
                                fee: aminoMsgHelper.fee(localStorage.getItem('fee'), 250000),
                                chain_id: persistence.chainId,
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
                    });
                } else {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage("Mnemonic not matched");
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
    const disabled = (
        helper.ValidateFrom(toValidatorAddress).message !== ''
    );

    const popoverMemo = (
        <Popover id="popover-memo">
            <Popover.Content>
                {t("MEMO_NOTE")}
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
                        Redelegate from {props.moniker}
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                            <div className="form-field">
                                <p className="label">Redelegate to</p>
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
                                                        value={validator.operator_address}>
                                                        {validator.description.moniker}
                                                    </MenuItem>
                                                );
                                            }
                                        })
                                    }
                                </Select>
                            </div>
                            <div className="form-field">
                                <p className="label">{t("REDELEGATION_AMOUNT")} (XPRT)</p>
                                <div className="amount-field">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        name="amount"
                                        placeholder={t("SEND_AMOUNT")}
                                        defaultValue={amount || ''}
                                        step="any"
                                        className={amount > props.delegationAmount ? "error-amount-field" : ""}
                                        onChange={handleAmountChange}
                                        required={true}
                                    />
                                    <span className={props.delegationAmount === 0 ? "empty info-data" : "info-data"}><span
                                        className="title">{t("DELEGATION_AMOUNT")}:</span> <span
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
                                                required={false}
                                            />
                                        </div>
                                        : ""
                                    }
                                </>: null
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
                                    className="button button-primary"
                                    disabled={checkAmountError || !props.delegateStatus || disabled || amount === 0 || amount > props.delegationAmount}
                                >{mode === "normal" ? "Next" : "Submit"}
                                </button>
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {seedModal ?
                <>
                    <Modal.Header closeButton>
                        Redelegate from {props.moniker}
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
                                            <p className="label">{t("PASSWORD")}</p>
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
                                                    name="redelegateAccountNumber"
                                                    id="redelegateAccountNumber"
                                                    placeholder={t("ACCOUNT_NUMBER")}
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("ACCOUNT_INDEX")}</p>
                                                <Form.Control
                                                    type="text"
                                                    name="redelegateAccountIndex"
                                                    id="redelegateAccountIndex"
                                                    placeholder={t("ACCOUNT_INDEX")}
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("BIP_PASSPHRASE")}</p>
                                                <Form.Control
                                                    type="password"
                                                    name="redelegatebip39Passphrase"
                                                    id="redelegatebip39Passphrase"
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

                                <button className="button button-primary">{t("REDELEGATE")}</button>
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
                            {t("SUCCESSFULL_REDELEGATED")}
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
                                    <button className="button" onClick={props.handleClose}>Done</button>
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
                            {t("FAILED_REDELEGATE")}
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
                                    <button className="button" onClick={props.handleClose}>Done</button>
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
        validators: state.validators.validators,
        balance: state.balance.amount,
        transferableAmount: state.balance.transferableAmount,
    };
};

export default connect(stateToProps)(ModalReDelegate);
