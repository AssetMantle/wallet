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
import Icon from "../../components/Icon";
import success from "../../assets/images/success.svg";
import transactions from "../../utils/transactions";
import helper from "../../utils/helper";
import aminoMsgHelper from "../../utils/aminoMsgHelper";
import Loader from "../../components/Loader";
import {SendMsg, TransferMsg} from "../../utils/protoMsgHelper";
import {connect} from "react-redux";
import config from "../../config";
import MakePersistence from "../../utils/cosmosjsWrapper";
import {useTranslation} from "react-i18next";
import FeeContainer from "../../components/Fee";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ActionHelper from "../../utils/actions";

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;

const IbcTxn = (props) => {
    const {t} = useTranslation();
    const [amountField, setAmountField] = useState(0);
    const [toAddress, setToAddress] = useState('');
    const [chain, setChain] = useState("");
    const [txResponse, setTxResponse] = useState('');
    const [mnemonicForm, setMnemonicForm] = useState(false);
    const [show, setShow] = useState(true);
    const [advanceMode, setAdvanceMode] = useState(false);
    const [memoStatus, setMemoStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [keplerError, setKeplerError] = useState( "");
    const [loader, setLoader] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [memoContent, setMemoContent] = useState('');
    let mode = localStorage.getItem('loginMode');
    let loginAddress = localStorage.getItem('address');
    const [checkAmountError, setCheckAmountError] = useState(false);
    const [checkAmountWarning, setCheckAmountWarning] = useState(false);

    const handleClose = () => {
        setShow(false);
        setMnemonicForm(false);
        setTxResponse('');
        setErrorMessage("");
    };
    const handleAmountChange = (evt) => {
        let rex = /^\d*\.?\d{0,2}$/;
        if (rex.test(evt.target.value)) {
            if ((props.transferableAmount - (evt.target.value * 1)) < transactions.XprtConversion(parseInt(localStorage.getItem('fee')))) {
                setCheckAmountError(true);
            } else {
                setCheckAmountError(false);
            }
            if ((props.transferableAmount - (evt.target.value * 1)) < transactions.XprtConversion(2 * parseInt(localStorage.getItem('fee'))) && (props.transferableAmount - (evt.target.value * 1)) >= transactions.XprtConversion(parseInt(localStorage.getItem('fee')))) {
                setCheckAmountWarning(true);
            } else {
                setCheckAmountWarning(false);
            }
            setAmountField(evt.target.value * 1);
        } else {
            return false;
        }
    };

    useEffect(() => {
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
    }, []);

    const handleSubmit = async event => {
        event.preventDefault();
        // if (helper.ValidateAddress(event.target.address.value)) {
        setToAddress(event.target.address.value);
        if (mode === "normal") {
            let memo = "";
            if (memoStatus) {
                memo = event.target.memo.value;
            }
            setMemoContent(memo);
            let memoCheck = transactions.mnemonicValidation(memo, loginAddress);
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
        // } else {
        //     setKeplerError("Invalid Recipient Address");
        // }
    };
    const handleSubmitKepler = event => {
        setShow(true);
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([SendMsg(loginAddress, event.target.address.value, (amountField * config.xprtValue))], aminoMsgHelper.fee(0, 250000));
        response.then(result => {
            if (result.code !== undefined) {
                helper.AccountChangeCheck(result.rawLog);
            }
            setMnemonicForm(true);
            setTxResponse(result);
            setLoader(false);
        }).catch(err => {
            setLoader(false);
            setKeplerError(err.message);
            helper.AccountChangeCheck(err.message);
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
            let promise = transactions.PrivateKeyReader(event.target.uploadFile.files[0], password, accountNumber, addressIndex, bip39Passphrase, loginAddress);
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
                setErrorMessage(decryptedData.error);
            } else {
                userMnemonic = decryptedData.mnemonic;
                setErrorMessage("");
            }

        }

        if (userMnemonic !== undefined) {
            let latestBlockHeight = 0;
            let blockHeightResponse = ActionHelper.getLatestBlock();
            await blockHeightResponse.then(function (result) {
                latestBlockHeight = result;
            }).catch(err => {
                setErrorMessage(err);
            });
            console.log(latestBlockHeight,"latestBlockHeight");
            const persistence = MakePersistence(accountNumber, addressIndex);
            const address = persistence.getAddress(userMnemonic, bip39Passphrase, true);
            const ecpairPriv = persistence.getECPairPriv(userMnemonic, bip39Passphrase);
            if (address.error === undefined && ecpairPriv.error === undefined) {
                if (address === loginAddress) {
                    let timeoutHeight = {
                        revisionNumber: "1234",
                        revisionHeight: latestBlockHeight
                    };
                    setImportMnemonic(false);
                    const response = transactions.TransactionWithMnemonic([TransferMsg(chain, address, toAddress, (amountField * config.xprtValue), timeoutHeight)], aminoMsgHelper.fee(localStorage.getItem('fee'), 250000), memoContent,
                        userMnemonic, transactions.makeHdPath(accountNumber, addressIndex), bip39Passphrase);
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
                Recipient’s address starts with persistence; for example: persistence14zmyw2q8keywcwhpttfr0d4xpggylsrmd4caf4
            </Popover.Content>
        </Popover>
    );

    const handleMemoChange = () => {
        setMemoStatus(!memoStatus);
    };
    const onChangeSelect = (evt) => {
        setChain(evt.target.value);
    };
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
                            {/*<MenuItem*/}
                            {/*    key={1}*/}
                            {/*    className=""*/}
                            {/*    value="cosmos">*/}
                            {/*    Cosmos*/}
                            {/*</MenuItem>*/}
                             
                        </Select>
                    </div>
                    <div className="form-field">
                        <p className="label info">Recipient Address
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
                        <p className="label">Amount (XPRT)</p>
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
                            <span className={props.transferableAmount === 0 ? "empty info-data" : "info-data"}><span
                                className="title">Transferable Balance:</span> <span
                                className="value"
                                title={props.transferableAmount}>{props.transferableAmount.toFixed(6)} XPRT</span> </span>
                        </div>
                    </div>
                    {(localStorage.getItem("fee") * 1) !== 0 ?
                        <>
                            <div className="form-field p-0">
                                <p className="label"></p>
                                <div className="amount-field">
                                    <p className={checkAmountWarning ? "show amount-warning text-left" : "hide amount-warning"}>
                                        <b>Warning : </b>{t("AMOUNT_WARNING_MESSAGE")}</p>
                                </div>
                            </div>
                            <div className="form-field p-0">
                                <p className="label"></p>
                                <div className="amount-field">
                                    <p className={checkAmountError ? "show amount-error text-left" : "hide amount-error"}>{t("AMOUNT_ERROR_MESSAGE")}</p>
                                </div>
                            </div>
                        </>
                        : null
                    }

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

                        </>
                        : null
                    }
                    {keplerError !== '' ?
                        <p className="form-error">{keplerError}</p> : null}
                    <div className="buttons">
                        <FeeContainer/>
                        <button className="button button-primary"
                            disabled={props.transferableAmount < (amountField * 1 + transactions.XprtConversion(parseInt(localStorage.getItem('fee')))) || amountField === 0 || props.transferableAmount === 0}>Send
                        </button>
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
                                        Send Token
                                    </Modal.Header>
                                    <Modal.Body className="create-wallet-body import-wallet-body">
                                        <Form onSubmit={handleMnemonicSubmit}>
                                            {
                                                importMnemonic ?
                                                    <>
                                                        <div className="form-field upload">
                                                            <p className="label"> KeyStore file</p>
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
                                                            Advanced
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
                                                <button className="button button-primary">Send</button>
                                            </div>

                                        </Form>

                                    </Modal.Body>
                                </>
                                : <>
                                    {
                                        txResponse.code === undefined || txResponse.code === 0 ?
                                            <>
                                                <Modal.Header className="result-header success">
                                                    Successfully Send!
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
                                                    Failed to Send
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
                                                            <button className="button" onClick={handleClose}>Done</button>
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
        transferableAmount: state.balance.transferableAmount,
    };
};

export default connect(stateToProps)(IbcTxn);
