import React, {useContext, useState, useEffect} from "react";
import {
    Accordion,
    AccordionContext,
    Card,
    Form,
    Modal,
    OverlayTrigger,
    Popover,
    useAccordionToggle
} from "react-bootstrap";
import Icon from "../../../components/Icon";
import success from "../../../assets/images/success.svg";
import transactions from "../../../utils/transactions";
import helper from "../../../utils/helper";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import Loader from "../../../components/Loader";
import {connect} from "react-redux";
import config from "../../../config";
import MakePersistence from "../../../utils/cosmosjsWrapper";
import {useTranslation} from "react-i18next";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import GasContainer from "../../Gas";
const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;

const IbcTxn = (props) => {
    const {t} = useTranslation();
    const [amountField, setAmountField] = useState(0);
    const [toAddress, setToAddress] = useState('');
    const [chain, setChain] = useState("");
    const [channelID, setChannelID] = useState("");
    const [txResponse, setTxResponse] = useState('');
    const [mnemonicForm, setMnemonicForm] = useState(false);
    const [show, setShow] = useState(true);
    const [advanceMode, setAdvanceMode] = useState(false);
    const [memoStatus, setMemoStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [keplerError, setKeplerError] = useState( "");
    const [loader, setLoader] = useState(false);
    const [customChain, setCustomChain] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [memoContent, setMemoContent] = useState('');
    const [gas, setGas] = useState(config.gas);
    const [gasValidationError, setGasValidationError] = useState(false);
    const [fee, setFee] = useState(config.averageFee);
    const [showGasField, setShowGasField] = useState(false);
    const [activeFeeState, setActiveFeeState] = useState("Average");
    const [checkAmountError, setCheckAmountError] = useState(false);
    const [token, setToken] = useState("uxprt");
    const [tokenDenom, setTokenDenom] = useState("uxprt");
    const [transferableAmount, setTransferableAmount] = useState(props.transferableAmount);
    const [tokenItem, setTokenItem] = useState({});
    const [zeroFeeAlert, setZeroFeeAlert] = useState(false);
    let mode = localStorage.getItem('loginMode');
    let loginAddress = localStorage.getItem('address');
    
    const handleClose = () => {
        setShow(false);
        setMnemonicForm(false);
        setTxResponse('');
        setErrorMessage("");
    };
    const handleAmountChange = (evt) => {
        let rex = /^\d*\.?\d{0,2}$/;
        if (rex.test(evt.target.value)) {
            if(tokenDenom === "uxprt") {
                if ((props.transferableAmount - (evt.target.value * 1)) < transactions.XprtConversion(fee)) {
                    setCheckAmountError(true);
                } else {
                    setCheckAmountError(false);
                }
            }else {
                if (props.transferableAmount < transactions.XprtConversion(fee) || transferableAmount < (evt.target.value * 1)) {
                    setCheckAmountError(true);
                } else {
                    setCheckAmountError(false);
                }
            }
            setAmountField(evt.target.value * 1);
        } else {
            return false;
        }
    };

    useEffect(() => {
        setFee(gas * fee);
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
    }, []);

    const handleSubmit = async event => {
        event.preventDefault();
        setToAddress(event.target.address.value);
        if(customChain){
            let channel = event.target.channel.value;
            setChannelID(channel);
        }
        if (mode === "normal") {
            let memo = "";
            if (memoStatus) {
                memo = event.target.memo.value;
            }
            setMemoContent(memo);
            let memoCheck = helper.mnemonicValidation(memo, loginAddress);
            if (memoCheck) {
                setKeplerError(t("MEMO_MNEMONIC_CHECK_ERROR"));
            } else {
                setKeplerError('');
                setMnemonicForm(true);
                setShow(true);
            }
        } else {
            setKeplerError('');
            setMnemonicForm(true);
            setShow(true);
        }
        if(mode === "normal" && (localStorage.getItem("fee") * 1) === 0 ){
            setFee(0);
        }
    };
    const handleSubmitKepler = async event => {
        setShow(true);
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr( [await transactions.MakeIBCTransferMsg(channelID, loginAddress,
            event.target.address.value,(amountField * config.xprtValue), undefined, undefined, tokenDenom)],aminoMsgHelper.fee(0, 250000));
        response.then(result => {
            if (result.code !== undefined) {
                helper.accountChangeCheck(result.rawLog);
            }
            setMnemonicForm(true);
            setTxResponse(result);
            setLoader(false);
        }).catch(err => {
            setLoader(false);
            setKeplerError(err.message);
            helper.accountChangeCheck(err.message);
        });
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

    if (loader) {
        return <Loader/>;
    }

    const handleMnemonicSubmit = async (evt) => {
        setLoader(true);
        setKeplerError('');
        evt.preventDefault();
        setErrorMessage("");
        let userMnemonic;
        let accountNumber = 0;
        let addressIndex = 0;
        let bip39Passphrase = "";
        if (advanceMode) {
            accountNumber = evt.target.sendAccountNumber.value;
            addressIndex = evt.target.sendAccountIndex.value;
            bip39Passphrase = evt.target.sendbip39Passphrase.value;
        }

        if (importMnemonic) {
            const password = evt.target.password.value;
            let promise = transactions.PrivateKeyReader(evt.target.uploadFile.files[0], password, accountNumber, addressIndex, bip39Passphrase, loginAddress);
            await promise.then(function (result) {
                userMnemonic = result;
            }).catch(err => {
                setLoader(false);
                setErrorMessage(err);
            });
        } else {
            const password = evt.target.password.value;
            const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
            const res = JSON.parse(encryptedMnemonic);
            const decryptedData = helper.decryptStore(res, password);
            if (decryptedData.error != null) {
                setLoader(false);
                setErrorMessage(decryptedData.error);
            } else {
                userMnemonic = decryptedData.mnemonic;
                setErrorMessage("");
            }

        }

        if (userMnemonic !== undefined) {
            const persistence = MakePersistence(accountNumber, addressIndex);
            const address = persistence.getAddress(userMnemonic, bip39Passphrase, true);
            const ecpairPriv = persistence.getECPairPriv(userMnemonic, bip39Passphrase);
            if (address.error === undefined && ecpairPriv.error === undefined) {
                if (address === loginAddress) {
                    // let timeoutHeight = {
                    //     revisionNumber: "",
                    //     revisionHeight: ""
                    // };
                    setImportMnemonic(false);
                    // amount field should be int
                    const response = transactions.TransactionWithMnemonic( [await transactions.MakeIBCTransferMsg(channelID, address,
                        toAddress,(amountField * config.xprtValue), undefined, undefined, tokenDenom)],
                    aminoMsgHelper.fee(Math.trunc(fee), gas), memoContent, userMnemonic,
                    transactions.makeHdPath(accountNumber, addressIndex), bip39Passphrase);
                    response.then(result => {
                        setTxResponse(result);
                        setLoader(false);
                        setAdvanceMode(false);
                        setMnemonicForm(true);
                    }).catch(err => {
                        setLoader(false);
                        setErrorMessage(err.message);
                    });
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

    const handleMemoChange = () => {
        setMemoStatus(!memoStatus);
    };

    const onChangeSelect = (evt) => {
        if(evt.target.value === "Custom"){
            setCustomChain(true);
            setChain(evt.target.value);
        }else {
            setCustomChain(false);
            let id = evt.target.value.substr(evt.target.value.indexOf('/') + 1);
            setChannelID(id);
            setChain(evt.target.value);
        }
    };

    const handleFee = (feeType, feeValue) => {
        if(feeType === "Low"){
            setZeroFeeAlert(true);
        }
        setActiveFeeState(feeType);
        setFee(gas * feeValue);
        if ((props.transferableAmount - (amountField*1)) < transactions.XprtConversion(gas * feeValue)) {
            setGasValidationError(true);
            setCheckAmountError(true);
        }else {
            setGasValidationError(false);
            setCheckAmountError(false);
        }
    };

    const handleGas = () => {
        setShowGasField(!showGasField);
    };

    const handleGasChange = (event) => {
        if((event.target.value * 1) >= 80000 && (event.target.value * 1) <= 2000000){
            setGasValidationError(false);
            setGas(event.target.value * 1);
            if((localStorage.getItem("fee") * 1) !== 0) {
                if (activeFeeState === "Average") {
                    setFee((event.target.value * 1) * config.averageFee);
                } else if (activeFeeState === "High") {
                    setFee((event.target.value * 1) * config.highFee);
                } else if (activeFeeState === "Low") {
                    setFee((event.target.value * 1) * config.lowFee);
                }
                if (activeFeeState === "Average" && (transactions.XprtConversion((event.target.value * 1) * config.averageFee)) + amountField > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "High" && (transactions.XprtConversion((event.target.value * 1) * config.highFee)) + amountField > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "Low" && (transactions.XprtConversion((event.target.value * 1) * config.lowFee)) + amountField > props.transferableAmount) {
                    setCheckAmountError(true);
                } else {
                    setCheckAmountError(false);
                }
            }
        }else {
            setGasValidationError(true);
        }


    };

    const onTokenChangeSelect = (evt) => {
        setToken(evt.target.value);
        if(evt.target.value === 'uxprt'){
            setTokenDenom(evt.target.value);
            setTransferableAmount(props.transferableAmount);
        }
        else {
            props.tokenList.forEach((item) => {
                if(evt.target.value === item.denomTrace){
                    setTokenDenom(item.denom.baseDenom);
                    setTransferableAmount(transactions.XprtConversion(item.amount * 1));
                    setTokenItem(item);
                }
            });
        }
    };

    const popoverMemo = (
        <Popover id="popover-memo">
            <Popover.Content>
                {t("MEMO_NOTE")}
            </Popover.Content>
        </Popover>
    );
    const popover = (
        <Popover id="popover">
            <Popover.Content>
                Recipient’s address starts with cosmos; for example: cosmos108juerwthyqolqewl74kewg882kjuert123kls
            </Popover.Content>
        </Popover>
    );

    return (
        <div className="send-container">
            <div className="form-section">
                <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmit}>
                    <div className="form-field">
                        <p className="label">{t("CHAIN")}</p>
                        <Select value={chain} className="validators-list-selection"
                            onChange={onChangeSelect} displayEmpty>
                            <MenuItem value="" key={0}>
                                <em>{t("SELECT_CHAIN")}</em>
                            </MenuItem>
                            {
                                config.channels.map((channel, index) => {
                                    return (
                                        <MenuItem
                                            key={index + 1}
                                            className=""
                                            value={channel.id}>
                                            {channel.name}
                                        </MenuItem>
                                    );
                                })
                            }
                            <MenuItem
                                key={config.channels.length + 1}
                                className=""
                                value="Custom">
                                {t("CUSTOM")}
                            </MenuItem>
                        </Select>
                    </div>
                    {
                        customChain ?
                            <>
                                <div className="form-field">
                                    <p className="label info">{t("PORT")}</p>
                                    <Form.Control
                                        type="text"
                                        name="port"
                                        placeholder={t("ENTER_PORT")}
                                        required={true}
                                        value="transfer"
                                    />
                                </div>
                                <div className="form-field">
                                    <p className="label info">{t("CHANNEL")}</p>
                                    <Form.Control
                                        type="text"
                                        name="channel"
                                        placeholder={t("ENTER_CHANNEL")}
                                        required={true}
                                    />
                                </div>
                            </>
                            : ""
                    }

                    <div className="form-field">
                        <p className="label info">{t("RECIPIENT_ADDRESS")}
                            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
                                <button className="icon-button info" type="button"><Icon
                                    viewClass="arrow-right"
                                    icon="info"/></button>
                            </OverlayTrigger></p>
                        <Form.Control
                            type="text"
                            name="address"
                            placeholder="Enter Recipient's address "
                            required={true}
                        />
                    </div>
                    <div className="form-field p-0">
                        <p className="label">{t("AMOUNT")} (XPRT)</p>
                        <div className="amount-field">
                            <Form.Control
                                type="number"
                                min={0}
                                name="amount"
                                placeholder={t("SEND_AMOUNT")}
                                step="any"
                                className={amountField > props.transferableAmount ? "error-amount-field" : ""}
                                value={amountField}
                                onChange={handleAmountChange}
                                required={true}
                            />
                            {
                                tokenDenom === "uxprt" ?
                                    <span className={props.transferableAmount === 0 ? "empty info-data" : "info-data"}><span
                                        className="title">Transferable Balance:</span> <span
                                        className="value"
                                        title={props.transferableAmount}>{props.transferableAmount.toLocaleString()} XPRT</span> </span>
                                    :
                                    <span title={tokenItem.denomTrace} className={transferableAmount === 0 ? "empty info-data" : "info-data"}>
                                        <span
                                            className="title">Transferable Balance:</span> <span
                                            className="value">{transferableAmount.toLocaleString()}  ATOM ( IBC Trace path - {tokenItem.denom.path} , denom: {tokenItem.denom.baseDenom}  )</span> </span>
                            }
                        </div>
                    </div>
                    {mode === "normal" ?
                        <>
                            <div className="form-field">
                                <p className="label">{t("TOKEN")}</p>
                                <Select value={token} className="validators-list-selection"
                                    onChange={onTokenChangeSelect} displayEmpty>
                                    {
                                        props.tokenList.map((item, index) => {
                                            if(item.denom === "uxprt"){
                                                return (
                                                    <MenuItem
                                                        key={index + 1}
                                                        className=""
                                                        value={item.denom}>
                                                        XPRT
                                                    </MenuItem>
                                                );
                                            }
                                            if(item.denom.baseDenom === "uatom"){
                                                return (
                                                    <MenuItem
                                                        key={index + 1}
                                                        className=""
                                                        value={item.denomTrace}>
                                                        ATOM
                                                    </MenuItem>
                                                );
                                            }
                                        })
                                    }
                                </Select>
                            </div>
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
                                    : ""}
                            </div>

                        </>
                        : null
                    }
                    {keplerError !== '' ?
                        <p className="form-error">{keplerError}</p>
                        : null
                    }
                    <div className="buttons">
                        {mode === "normal"  ?
                            <div className="button-section">
                                <GasContainer checkAmountError={checkAmountError} activeFeeState={activeFeeState}
                                    onClick={handleFee} gas={gas} zeroFeeAlert={zeroFeeAlert} setZeroFeeAlert={setZeroFeeAlert}/>
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
                                <button className="button button-primary"
                                    disabled={checkAmountError || amountField === 0 || props.transferableAmount === 0 || gasValidationError}
                                >{t("NEXT")}
                                </button>
                            </div>
                            :
                            <button className="button button-primary"
                                disabled={checkAmountError || amountField === 0 || props.transferableAmount === 0}
                            >{t("SUBMIT")}</button>
                        }
                    </div>
                </Form>
            </div>

            {
                mnemonicForm ?
                    <Modal show={show} onHide={handleClose} backdrop="static" centered className="modal-custom">
                        {
                            txResponse === '' ?
                                <>
                                    <Modal.Header closeButton>
                                        {t("SEND_TOKEN")}
                                    </Modal.Header>
                                    <Modal.Body className="create-wallet-body import-wallet-body">
                                        <Form onSubmit={handleMnemonicSubmit}>
                                            {
                                                importMnemonic ?
                                                    <>
                                                        <div className="form-field upload">
                                                            <p className="label"> {t("KEY_STORE_FILE")}</p>
                                                            <Form.File id="exampleFormControlFile1" name="uploadFile"
                                                                className="file-upload" accept=".json"
                                                                required={true}/>
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
                                                                    name="sendAccountNumber"
                                                                    id="sendAccountNumber"
                                                                    placeholder={t("ACCOUNT_NUMBER")}
                                                                    required={advanceMode}
                                                                />
                                                            </div>
                                                            <div className="form-field">
                                                                <p className="label">{t("ACCOUNT_INDEX")}</p>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="sendAccountIndex"
                                                                    id="sendAccountIndex"
                                                                    placeholder={t("ACCOUNT_INDEX")}
                                                                    required={advanceMode}
                                                                />
                                                            </div>
                                                            <div className="form-field">
                                                                <p className="label">{t("BIP_PASSPHRASE")}</p>
                                                                <Form.Control
                                                                    type="password"
                                                                    name="sendbip39Passphrase"
                                                                    id="sendbip39Passphrase"
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
                                                <button className="button button-primary"> {t("SEND")}</button>
                                            </div>

                                        </Form>

                                    </Modal.Body>
                                </>
                                : <>
                                    {
                                        txResponse.code === undefined || txResponse.code === 0 ?
                                            <>
                                                <Modal.Header className="result-header success">
                                                    {t("SUCCESSFUL_SEND")}
                                                </Modal.Header>
                                                <Modal.Body className="delegate-modal-body">
                                                    <div className="result-container">
                                                        <img src={success} alt="success-image"/>
                                                        {mode === "kepler" ?
                                                            <a
                                                                href={`${EXPLORER_API}/transaction?txHash=${txResponse.transactionHash}`}
                                                                target="_blank" className="tx-hash"
                                                                rel="noopener noreferrer">Tx
                                                                Hash: {txResponse.transactionHash}</a>
                                                            :
                                                            <a
                                                                href={`${EXPLORER_API}/transaction?txHash=${txResponse.transactionHash}`}
                                                                target="_blank" className="tx-hash"
                                                                rel="noopener noreferrer">Tx
                                                                Hash: {txResponse.transactionHash}</a>
                                                        }

                                                        <div className="buttons">
                                                            <button className="button" onClick={handleClose}>Done</button>
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                            </>
                                            : <>
                                                <Modal.Header className="result-header error">
                                                    {t("FAILED_SEND")}
                                                </Modal.Header>
                                                <Modal.Body className="delegate-modal-body">
                                                    <div className="result-container">

                                                        {mode === "kepler" ?
                                                            <>
                                                                <p>{txResponse.rawLog}</p>
                                                                <a
                                                                    href={`${EXPLORER_API}/transaction?txHash=${txResponse.transactionHash}`}
                                                                    target="_blank" className="tx-hash"
                                                                    rel="noopener noreferrer">Tx
                                                                    Hash: {txResponse.transactionHash}</a>
                                                            </>
                                                            :
                                                            <>
                                                                <p>{txResponse.rawLog === "panic message redacted to hide potentially sensitive system info: panic" ? "You cannot send vesting amount" : txResponse.rawLog}</p>
                                                                <a
                                                                    href={`${EXPLORER_API}/transaction?txHash=${txResponse.transactionHash}`}
                                                                    target="_blank" className="tx-hash"
                                                                    rel="noopener noreferrer">Tx
                                                                    Hash: {txResponse.transactionHash}</a>
                                                            </>
                                                        }
                                                        <div className="buttons">
                                                            <button className="button" onClick={handleClose}> {t("DONE")}</button>
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                            </>
                                    }
                                </>
                        }
                    </Modal>
                    : null

            }
        </div>
    );
};


const stateToProps = (state) => {
    return {
        balance: state.balance.amount,
        tokenList: state.balance.tokenList,
        transferableAmount: state.balance.transferableAmount,
    };
};

export default connect(stateToProps)(IbcTxn);
