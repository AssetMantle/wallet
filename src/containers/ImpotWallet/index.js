import React, {useContext, useState} from "react";
import {
    Form,
    Accordion,
    Card,
    AccordionContext,
    useAccordionToggle, Modal
} from "react-bootstrap";
import Icon from "../../components/Icon";
import wallet from "../../utils/wallet";
import helper from "../../utils/helper"
import {useHistory} from "react-router-dom";
import ModalFaq from "../Faq";
import GeneratePrivateKey from "./GeneratePrivateKey";

const ModalImportWallet = (props) => {
    const [show, setShow] = useState(true);
    const history = useHistory();
    const [showFaq, setShowFaq] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [mnemonicForm, setMnemonicForm] = useState(true);
    const [responseDataShow, setResponseDataShow] = useState(false);
    const [response, setResponse] = useState("");
    const [jsonName, setJsonName] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [advanceMode, setAdvanceMode] = useState(false);
    const [generateKey, setGenerateKey] = useState(false);
    const [privateAdvanceMode, setPrivateAdvanceMode] = useState(false);
    const handleSubmit = async event => {
        event.preventDefault();
        let responseData;

        if (advanceMode) {
            let accountNumber = document.getElementById('accountNumber').value;
            let addressIndex = document.getElementById('accountIndex').value;
            let bip39Passphrase = document.getElementById('bip39Passphrase').value;
            const walletPath = wallet.getWalletPath(accountNumber, addressIndex);
            responseData = wallet.createWallet(event.target.mnemonic.value, walletPath, bip39Passphrase);

        } else {
            responseData = wallet.createWallet(event.target.mnemonic.value);

        }
        if (responseData.error) {
            setErrorMessage(responseData.error);
        } else {
            setResponse(responseData);
            setAdvanceMode(false);
            setPrivateAdvanceMode(false);
            setErrorMessage("");
            setMnemonicForm(false);
            setResponseDataShow(true);
        }

    };

    const handlePrivateKeySubmit = async event => {
        const password = event.target.password.value;
        event.preventDefault();
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.uploadFile.files[0], "UTF-8");
        fileReader.onload = event => {
            const res = JSON.parse(event.target.result);
            const decryptedData = helper.decryptStore(res, password);
            if (decryptedData.error != null) {
                setErrorMessage(decryptedData.error)
            } else {
                let responseData;
                if (advanceMode) {
                    let accountNumber = document.getElementById('privateAccountNumber').value;
                    let addressIndex = document.getElementById('privateAccountIndex').value;
                    let bip39Passphrase = document.getElementById('bip39Passphrase').value;
                    const walletPath = wallet.getWalletPath(accountNumber, addressIndex);
                    responseData = wallet.createWallet(decryptedData.mnemonic, walletPath, bip39Passphrase);
                } else {
                    responseData = wallet.createWallet(decryptedData.mnemonic);
                }
                if (responseData.error) {
                    setErrorMessage(responseData.error);
                } else {
                    setAdvanceMode(false);
                    setPrivateAdvanceMode(false);
                    setResponse(responseData);
                    setResponseDataShow(true);
                    setMnemonicForm(false);
                    setErrorMessage("");
                }
            }
        };
    };

    const handleLogin = () => {
        if (errorMessage === "") {
            localStorage.setItem('loginToken', 'loggedIn');
            localStorage.setItem('address', response.address);
            history.push('/dashboard/wallet');
        }
    };

    const handlePrivateKey = (value) => {
        setImportMnemonic(value);
    };
    const handleRoute = (key) => {
        if (key === 'generateKey') {
            setGenerateKey(true);
            setResponseDataShow(false)
        }
        if (key === "hideGenerateKey") {
            setGenerateKey(false);
            setResponseDataShow(true)
        }
    };

    function ContextAwareToggle({children, eventKey, callback}) {
        const currentEventKey = useContext(AccordionContext);

        const decoratedOnClick = useAccordionToggle(
            eventKey,
            () => callback && callback(eventKey),
        );
        const handleAccordion = (event) => {
            decoratedOnClick(event);
            setPrivateAdvanceMode(!privateAdvanceMode);
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

    const handlePrevious = () => {
        setResponseDataShow(false);
        setMnemonicForm(true);
    };

    const handleClose = () => {
        setShow(false);
        if (props.name === "createWallet") {
            props.setShowImportWallet(false);
            props.handleClose()
        } else if (props.name === "homepage") {
            props.setRoutName("")
        }
    };

    return (
        <>
            <Modal backdrop="static" show={show} onHide={handleClose} centered
                   className="create-wallet-modal large seed">
                {
                    mnemonicForm ?
                        <>
                            <Modal.Header closeButton>
                                <h3 className="heading">Importing Wallet</h3>
                            </Modal.Header>
                            <div className="create-wallet-body import-wallet-body">
                                {
                                    importMnemonic ?
                                        <Form onSubmit={handleSubmit}>
                                            <div className="text-center">
                                                <p onClick={() => handlePrivateKey(false)} className="import-name">Use
                                                    private key file</p>
                                            </div>
                                            <div className="form-field">
                                                <p className="label">Enter Seed</p>
                                                <Form.Control as="textarea" rows={3} name="mnemonic"
                                                              placeholder="Enter Seed"
                                                              required={true}/>
                                            </div>
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
                                                                    type="number"
                                                                    min={0}
                                                                    max={4294967295}
                                                                    name="accountNumber"
                                                                    id="accountNumber"
                                                                    placeholder="Account number"
                                                                    required={advanceMode ? true : false}
                                                                />
                                                            </div>
                                                            <div className="form-field">
                                                                <p className="label">Account Index</p>
                                                                <Form.Control
                                                                    type="number"
                                                                    min={0}
                                                                    max={4294967295}
                                                                    name="accountIndex"
                                                                    id="accountIndex"
                                                                    placeholder="Account Index"
                                                                    required={advanceMode ? true : false}
                                                                />
                                                            </div>
                                                            <div className="form-field">
                                                                <p className="label">bip39Passphrase</p>
                                                                <Form.Control
                                                                    type="password"
                                                                    name="bip39Passphrase"
                                                                    id="bip39Passphrase"
                                                                    placeholder="Enter bip39Passphrase (optional)"
                                                                    required={false}
                                                                />
                                                            </div>
                                                        </>
                                                    </Accordion.Collapse>
                                                </Card>
                                            </Accordion>
                                            {errorMessage !== ''
                                                ? <p className="form-error">{errorMessage}</p>
                                                : null

                                            }
                                            <div className="buttons">
                                                <button className="button button-primary">Next</button>
                                            </div>
                                        </Form>
                                        : <Form onSubmit={handlePrivateKeySubmit}>
                                            <div className="text-center">
                                                <p onClick={() => handlePrivateKey(true)} className="import-name">Use
                                                    Mnemonic</p>
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
                                                <p className="label"> Key Store file</p>
                                                <Form.File id="exampleFormControlFile1" name="uploadFile"
                                                           className="file-upload" accept=".json" required={true}/>
                                            </div>
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
                                                                    type="number"
                                                                    min={0}
                                                                    max={4294967295}
                                                                    name="privateAccountNumber"
                                                                    id="privateAccountNumber"
                                                                    placeholder="Account number"
                                                                    required={privateAdvanceMode ? true : false}
                                                                />
                                                            </div>
                                                            <div className="form-field">
                                                                <p className="label">Account Index</p>
                                                                <Form.Control
                                                                    type="number"
                                                                    min={0}
                                                                    max={4294967295}
                                                                    name="privateAccountIndex"
                                                                    id="privateAccountIndex"
                                                                    placeholder="Account Index"
                                                                    required={privateAdvanceMode ? true : false}
                                                                />
                                                            </div>
                                                            <div className="form-field">
                                                                <p className="label">bip39Passphrase</p>
                                                                <Form.Control
                                                                    type="password"
                                                                    name="bip39Passphrase"
                                                                    id="bip39Passphrase"
                                                                    placeholder="Enter bip39Passphrase (optional)"
                                                                    required={false}
                                                                />
                                                            </div>
                                                        </>
                                                    </Accordion.Collapse>
                                                </Card>
                                            </Accordion>

                                            {errorMessage !== ''
                                                ? <p className="form-error">{errorMessage}</p>
                                                : null

                                            }
                                            <div className="buttons">
                                                <button className="button button-primary">Next</button>
                                            </div>
                                            <div className="note-section">
                                                <div className="exclamation"><Icon
                                                    viewClass="arrow-right"
                                                    icon="exclamation"/></div>
                                                <p>Password for decrypts your private key file.</p>
                                            </div>
                                        </Form>

                                }


                            </div>
                        </>
                        : null
                }
                {
                    responseDataShow ?
                        <>
                            <Modal.Header closeButton>
                                <h3 className="heading">Importing Wallet</h3>
                            </Modal.Header>
                            <div className="create-wallet-body import-wallet-body">
                                {errorMessage !== "" ?
                                    <div className="login-error"><p className="error-response">{errorMessage}</p></div>
                                    : <div>
                                        <p className="mnemonic-result"><b>Wallet path: </b>{response.walletPath}</p>
                                        <p className="mnemonic-result"><b>Address: </b>{response.address}</p>
                                        <div className="download-section">
                                            <div className="key-download" onClick={() => handleRoute('generateKey')}>
                                                <p> Generate Key Store File</p>
                                                <Icon viewClass="arrow-icon" icon="left-arrow"/>
                                            </div>
                                        </div>
                                    </div>
                                }

                                <div className="buttons">
                                    <button className="button button-secondary" onClick={() => handlePrevious(2)}>
                                        <Icon
                                            viewClass="arrow-right"
                                            icon="left-arrow"/>
                                    </button>
                                    <button className="button button-primary" onClick={handleClose}>Done</button>
                                </div>
                                <div className="note-section">
                                    <div className="exclamation"><Icon
                                        viewClass="arrow-right"
                                        icon="exclamation"/></div>
                                    <p>Please securely store the wallet path for future use</p>
                                </div>
                            </div>
                        </>
                        : null
                }

                {generateKey ?
                    <>
                        <Modal.Header closeButton>
                            <h3 className="heading">Importing Wallet</h3>
                        </Modal.Header>
                        <div className="create-wallet-body import-wallet-body">
                            <GeneratePrivateKey mnemonic={response.mnemonic} handleRoute={handleRoute}
                                                handleClose={handleClose} routeValue="hideGenerateKey"/>

                        </div>
                    </>
                    : null
                }
            </Modal>
            {showFaq
                ?
                <ModalFaq setShowFaq={setShowFaq}/>
                :
                null}
        </>

    );
};
export default ModalImportWallet;
