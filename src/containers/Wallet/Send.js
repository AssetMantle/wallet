import React, {useContext, useState} from "react";
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
import {SendMsg} from "../../utils/protoMsgHelper";
import {connect} from "react-redux";
import config from "../../config";
import MakePersistence from "../../utils/cosmosjsWrapper";
import {useTranslation} from "react-i18next";

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;

const Send = (props) => {
    const {t} = useTranslation();
    const [amountField, setAmountField] = useState(0);
    const [toAddress, setToAddress] = useState('');
    const [txResponse, setTxResponse] = useState('');
    const [mnemonicForm, setMnemonicForm] = useState(false);
    const [show, setShow] = useState(true);
    const [advanceMode, setAdvanceMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [keplerError, setKeplerError] = useState("");
    const [loader, setLoader] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [memoContent, setMemoContent] = useState('');
    let mode = localStorage.getItem('loginMode');
    let loginAddress = localStorage.getItem('address');

    const handleClose = () => {
        setShow(false);
        setMnemonicForm(false);
        setTxResponse('');
        setErrorMessage("")
    };
    const handleAmountChange = (evt) => {
        let rex = /^\d*\.?\d{0,2}$/;
        if (rex.test(evt.target.value)) {
            setAmountField(evt.target.value)
        } else {
            return false
        }
    };
    const handleSubmit = async event => {
        event.preventDefault();
        setToAddress(event.target.address.value);
        if (mode === "normal") {
            const memo = event.target.memo.value;
            setMemoContent(memo);
            let memoCheck = transactions.mnemonicValidation(memo, loginAddress);
            if (memoCheck) {
                setKeplerError("you entered your mnemonic as memo")
            }else {
                setKeplerError('');
                setMnemonicForm(true);
                setShow(true);
            }
        }else {
            setKeplerError('');
            setMnemonicForm(true);
            setShow(true);
        }

    };
    const handleSubmitKepler = event => {
        setShow(true);
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([SendMsg(loginAddress, event.target.address.value, (amountField * 1000000))], aminoMsgHelper.fee(0, 250000));
        response.then(result => {
            if(result.code !== undefined){
                helper.AccountChangeCheck(result.rawLog)
            }
            setMnemonicForm(true);
            setTxResponse(result);
            setLoader(false);
        }).catch(err => {
            setLoader(false);
            setKeplerError(err.message);
            helper.AccountChangeCheck(err.message)
            console.log(err.message, "send error")
        })
    };

    function ContextAwareToggle({children, eventKey, callback}) {
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

    const handlePrivateKey = (value) => {
        setImportMnemonic(value);
        setErrorMessage("");
    };
    if (loader) {
        return <Loader/>;
    }

    function PrivateKeyReader(file, password) {
        return new Promise(function (resolve, reject) {
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = event => {
                const res = JSON.parse(event.target.result);
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

    const handleMnemonicSubmit = async (evt) => {
        setLoader(true);
        setKeplerError('');
        evt.preventDefault();
        let userMnemonic;
        if (importMnemonic) {
            userMnemonic = evt.target.mnemonic.value;
        } else {
            const password = evt.target.password.value;
            var promise = PrivateKeyReader(evt.target.uploadFile.files[0], password);
            await promise.then(function (result) {
                userMnemonic = result;
            });
        }

        let accountNumber = 0;
        let addressIndex = 0;
        let bip39Passphrase = "";
        if (advanceMode) {
            accountNumber = evt.target.sendAccountNumber.value;
            addressIndex = evt.target.sendAccountIndex.value;
            bip39Passphrase = evt.target.sendbip39Passphrase.value;
        }

        const persistence = MakePersistence(accountNumber, addressIndex);
        const address = persistence.getAddress(userMnemonic, bip39Passphrase, true);
        const ecpairPriv = persistence.getECPairPriv(userMnemonic, bip39Passphrase);
        if (address.error === undefined && ecpairPriv.error === undefined) {
            if (address === loginAddress) {
                persistence.getAccounts(address).then(data => {
                    if (data.code === undefined) {
                        let [accountNumber, sequence] = transactions.getAccountNumberAndSequence(data);
                        let stdSignMsg = persistence.newStdMsg({
                            msgs: aminoMsgHelper.msgs(aminoMsgHelper.sendMsg((amountField * 1000000), address, toAddress)),
                            chain_id: persistence.chainId,
                            fee: aminoMsgHelper.fee(localStorage.getItem('fee'), 250000),
                            memo: memoContent,
                            account_number: String(accountNumber),
                            sequence: String(sequence)
                        });

                        const signedTx = persistence.sign(stdSignMsg, ecpairPriv, config.modeType);
                        persistence.broadcast(signedTx).then(response => {
                            setTxResponse(response);
                            console.log(response);
                            setLoader(false);
                            setAdvanceMode(false);
                            setMnemonicForm(true);
                        });
                    } else {
                        setLoader(false);
                        setAdvanceMode(false);
                        setErrorMessage(data.message);
                    }
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
    };

    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                The recipient’s address should start with persistenceXXXXXXXX....
            </Popover.Content>
        </Popover>
    );
    return (
        <div className="send-container">
            <div className="form-section">
                <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmit}>
                    <div className="form-field">
                        <p className="label info">Recipient Address
                            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
                                <button className="icon-button info"><Icon
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
                    <div className="form-field">
                        <p className="label">Amount (XPRT)</p>
                        <div className="amount-field">
                            <Form.Control
                                type="number"
                                min={0}
                                name="amount"
                                placeholder="Send Amount"
                                step="any"
                                value={amountField}
                                onChange={handleAmountChange}
                                required={true}
                            />
                        </div>
                    </div>
                    <div className="form-field">
                        <p className="label">{t("AVAILABLE_DELEGATE_AMOUNT")} (XPRT)</p>
                        <p className={props.balance === 0 ? "empty info-data" : "info-data"}>{props.balance}</p>
                    </div>
                    {mode === "normal" ?
                        <div className="form-field">
                            <p className="label">{t("MEMO")}</p>
                            <Form.Control
                                type="text"
                                name="memo"
                                placeholder={t("ENTER_MEMO")}
                                required={false}
                            />
                        </div> : null
                    }
                    {keplerError !== '' ?
                        <p className="form-error">{keplerError}</p> : null}
                    <div className="buttons">
                        <button className="button button-primary"
                                disabled={amountField > (props.balance * 1) || amountField === 0 || (props.balance * 1) === 0}>Send
                        </button>
                    </div>
                </Form>
            </div>

            {
                mnemonicForm ?
                    <Modal show={show} onHide={handleClose}  backdrop="static" centered className="modal-custom">
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
                                                    <div className="text-center">
                                                        <p onClick={() => handlePrivateKey(false)}
                                                           className="import-name">{t("USE_PRIVATE_KEY")} (KeyStore.json file)</p>
                                                    </div>
                                                    <div className="form-field">
                                                        <p className="label">{t("MNEMONIC")}</p>
                                                        <Form.Control as="textarea" rows={3} name="mnemonic"
                                                                      placeholder={t("ENTER_MNEMONIC")}
                                                                      required={true}/>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div className="text-center">
                                                        <p onClick={() => handlePrivateKey(true)}
                                                           className="import-name">{t("USE_MNEMONIC")} ({t("SEED_PHRASE")})</p>
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
                                                    <div className="form-field upload">
                                                        <p className="label"> KeyStore file</p>
                                                        <Form.File id="exampleFormControlFile1" name="uploadFile"
                                                                   className="file-upload" accept=".json"
                                                                   required={true}/>
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
                                            <p className="fee"> Default fee
                                                of {parseInt(localStorage.getItem('fee')) / 1000000}xprt will be cut
                                                from the wallet.</p>
                                            <button className="button button-primary">Send</button>
                                        </div>

                                    </Form>

                                </Modal.Body>
                                </>
                                : <>
                                    {
                                        txResponse.code === undefined ?
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
                                                                target="_blank" className="tx-hash">Tx
                                                                Hash: {txResponse.transactionHash}</a>
                                                            :
                                                            <a
                                                                href={`${EXPLORER_API}/transaction?txHash=${txResponse.txhash}`}
                                                                target="_blank" className="tx-hash">Tx
                                                                Hash: {txResponse.txhash}</a>
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
                                                                    target="_blank" className="tx-hash">Tx
                                                                    Hash: {txResponse.transactionHash}</a>
                                                            </>
                                                            :
                                                            <>
                                                                <p>{txResponse.raw_log === "panic message redacted to hide potentially sensitive system info: panic" ? "You cannot send vesting amount" : txResponse.raw_log}</p>
                                                                <a
                                                                    href={`${EXPLORER_API}/transaction?txHash=${txResponse.txhash}`}
                                                                    target="_blank" className="tx-hash">Tx
                                                                    Hash: {txResponse.txhash}</a>
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
    };
};

export default connect(stateToProps)(Send);
