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

const Send = () => {
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
    let address = localStorage.getItem('address');

    const handleClose = () => {
        setShow(false);
        setMnemonicForm(false);
        setTxResponse('');
        setErrorMessage("")
    };
    const handleAmountChange = (evt) => {
        let rex = /^(?!(0))\d*\.?\d{0,2}$/;
        if(rex.test(evt.target.value)){
            setAmountField(evt.target.value)
        }else{
            return false
        }
    };
    const handleSubmit = async event => {
        event.preventDefault();
        setToAddress(event.target.address.value);
        const memo = event.target.memo.value;
        setMemoContent(memo);
        setMnemonicForm(true);
        setShow(true);
    };
    const handleSubmitKepler = event => {
        setShow(true);
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([SendMsg(address, event.target.address.value, (amountField*1000000))], aminoMsgHelper.fee(0, 250000));
        response.then(result => {
            setMnemonicForm(true);
            setTxResponse(result);
            setLoader(false);
        }).catch(err => {
            setLoader(false);
            setKeplerError(err.message);
            console.log(err.message, "send error")
        })
    };

    function PrivateKeyReader(file, password) {
        return new Promise(function (resolve, reject) {
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = event => {
                const res = JSON.parse(event.target.result);
                const decryptedData = helper.decryptStore(res, password);
                if (decryptedData.error != null) {
                    setErrorMessage(decryptedData.error)
                } else {
                    resolve(decryptedData.mnemonic);
                    setErrorMessage("");
                }
            };
        });
    }

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
        let addressFromMnemonic = transactions.CheckAddressMisMatch(userMnemonic);
        addressFromMnemonic.then((addressResponse) => {
            console.log(addressResponse)
            if (address === addressResponse) {
                let accountNumber = 0;
                let addressIndex = 0;
                let bip39Passphrase = "";
                if (advanceMode) {
                    accountNumber = document.getElementById('sendAccountNumber').value;
                    addressIndex = document.getElementById('sendAccountIndex').value;
                    bip39Passphrase = document.getElementById('sendbip39Passphrase').value;
                }
                console.log(amountField*1000000)
                const response = transactions.TransactionWithMnemonic([SendMsg(address, toAddress, (amountField*1000000))], aminoMsgHelper.fee(5000, 250000), memoContent,
                    userMnemonic, transactions.makeHdPath(accountNumber, addressIndex), bip39Passphrase);
                response.then(result => {
                    console.log(result, "send success")
                    setMnemonicForm(true);
                    setTxResponse(result);
                    setLoader(false);
                }).catch(err => {
                    setLoader(false);
                    setErrorMessage(err.message)
                    console.log(err.message, "send error")
                })
            } else {
                setLoader(false);
                setErrorMessage("Enter Correct Mnemonic")
            }
        }).catch(err => {
            setLoader(false);
            setErrorMessage("Enter Correct Mnemonic")
        })
    };
    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                The recipient’s address should start with  persistenceXXXXXXXX....
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
                        <p className="label">Send Amount (XPRT)</p>
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
                    {mode === "normal" ?
                        <div className="form-field">
                            <p className="label">Memo</p>
                            <Form.Control as="textarea" rows={3} name="memo"
                                          placeholder="Enter Memo"
                                          required={false}/>
                        </div> : null
                    }
                    {keplerError !== '' ?
                        <p className="form-error">{keplerError}</p> : null}
                    <div className="buttons">
                        <button className="button button-primary">Send XPRT Tokens</button>
                    </div>
                </Form>
            </div>

            {
                mnemonicForm ?
                    <Modal show={show} onHide={handleClose} centered className="create-wallet-modal">
                        {
                            txResponse === '' ?
                                <Modal.Body className="create-wallet-body import-wallet-body">
                                    <h3 className="heading">Send Token
                                    </h3>
                                    <Form onSubmit={handleMnemonicSubmit}>
                                        {
                                            importMnemonic ?
                                                <>
                                                    <div className="text-center">
                                                        <p onClick={() => handlePrivateKey(false)}
                                                           className="import-name">Use
                                                            Private Key (KeyStore.json file)</p>
                                                    </div>
                                                    <div className="form-field">
                                                        <p className="label">Mnemonic</p>
                                                        <Form.Control as="textarea" rows={3} name="mnemonic"
                                                                      placeholder="Enter Mnemonic"
                                                                      required={true}/>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div className="text-center">
                                                        <p onClick={() => handlePrivateKey(true)}
                                                           className="import-name">Use
                                                            Mnemonic (Seed Phrase)</p>
                                                    </div>
                                                    <div className="form-field">
                                                        <p className="label">Password</p>
                                                        <Form.Control
                                                            type="password"
                                                            name="password"
                                                            placeholder="Enter Password"
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
                                                            <p className="label">Account</p>
                                                            <Form.Control
                                                                type="text"
                                                                name="privateAccountNumber"
                                                                id="sendAccountNumber"
                                                                placeholder="Account number"
                                                                required={advanceMode ? true : false}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <p className="label">Account Index</p>
                                                            <Form.Control
                                                                type="text"
                                                                name="privateAccountIndex"
                                                                id="sendAccountIndex"
                                                                placeholder="Account Index"
                                                                required={advanceMode ? true : false}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <p className="label">bip39Passphrase</p>
                                                            <Form.Control
                                                                type="password"
                                                                name="bip39Passphrase"
                                                                id="sendbip39Passphrase"
                                                                placeholder="Enter bip39Passphrase (optional)"
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
                                            <p className="fee"> Default fee of 0.005xprt will be cut from the wallet.</p>
                                            <button className="button button-primary">Send</button>
                                        </div>

                                    </Form>

                                </Modal.Body>
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
                                                            <p className="tx-hash">Tx Hash: {txResponse.transactionHash}</p>
                                                            : <p className="tx-hash">Tx
                                                                Hash: {txResponse.transactionHash}</p>}
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
                                                            <p className="tx-hash">Tx Hash: {txResponse.transactionHash}</p>
                                                            : <p className="tx-hash">Tx Hash: {txResponse.transactionHash}</p>}
                                                        {mode === "kepler" ?
                                                            <p>{txResponse.rawLog}</p>
                                                            : <p>{txResponse.rawLog}</p>}
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
export default Send;
