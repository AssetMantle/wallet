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
import GeneratePrivateKey from "../Common/GeneratePrivateKey";
import AddressImport from "./AddressImport";
const ModalImportWallet = (props) => {
    const [show, setShow] = useState(true);
    const history = useHistory();
    const [showFaq, setShowFaq] = useState(false);
    const [userMnemonic, setUserMnemonic] = useState("");
    const [passphraseError, setPassphraseError] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [mnemonicForm, setMnemonicForm] = useState(true);
    const [advancedForm, setAdvancedForm] = useState(false);
    const [withAddress, setWithAddress] = useState(false);
    const [advancedFormResponseData, setAdvancedFormResponseData] = useState("");
    const [advancedFormResponse, setAdvancedFormResponse] = useState(false);
    const [response, setResponse] = useState("");
    const [jsonName, setJsonName] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [advanceMode, setAdvanceMode] = useState(false);
    const [generateKey, setGenerateKey] = useState(false);
    const [privateAdvanceMode, setPrivateAdvanceMode] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault();
        const responseData = wallet.createWallet(event.target.mnemonic.value);
        if (responseData.error) {
            setErrorMessage(responseData.error);
        } else {
            setUserMnemonic(event.target.mnemonic.value);
            setAdvancedForm(true);
            setMnemonicForm(false);
            setErrorMessage("");
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
                setUserMnemonic(decryptedData.mnemonic);
                setAdvancedForm(true);
                setMnemonicForm(false);
                setErrorMessage("");
            }
        };
    };

    const handleLogin = () => {
        if (errorMessage === "") {
            localStorage.setItem('loginToken', 'loggedIn');
            localStorage.setItem('address', advancedFormResponseData.address);
            history.push('/dashboard/wallet');
        }
    };

    const handlePrivateKey = (value) => {
        setImportMnemonic(value);
        setErrorMessage("");
    };
    const handleRoute = (key) => {
        if (key === "generateKey") {
            setGenerateKey(true);
            setAdvancedForm(false)
        }
        if (key === "hideGenerateKey") {
            setGenerateKey(false);
            setAdvancedForm(true)
        }
        if(key === "withAddress"){
            setWithAddress(true);
            setMnemonicForm(false)
        }
        if(key === "hideWithAddress"){
            setWithAddress(false);
            setMnemonicForm(true)
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

    const handleSubmitAdvance = (event) => {
        event.preventDefault();
        let accountNumber = 0;
        let addressIndex = 0;
        let bip39Passphrase = "";
        if (advanceMode) {
            accountNumber = document.getElementById('accountNumber').value;
            addressIndex = document.getElementById('accountIndex').value;
            bip39Passphrase = document.getElementById('bip39Passphrase').value;
            if (accountNumber === "") {
                accountNumber = 0;
            }
            if (addressIndex === "") {
                addressIndex = 0;
            }
        }
        const walletPath = wallet.getWalletPath(accountNumber, addressIndex);
        const responseData = wallet.createWallet(userMnemonic, walletPath, bip39Passphrase);
        setAdvancedFormResponseData(responseData);
        setAdvancedForm(false);
        setAdvancedFormResponse(true);
        setAdvanceMode(false);
    };
    const handlePrevious = (formName) => {
        if (formName === "advancedForm") {
            setMnemonicForm(true);
            setAdvancedForm(false);
        } else if (formName === "advancedFormResponse") {
            setAdvancedForm(true);
            setAdvancedFormResponse(false)
        } else if (formName === "generateKey") {
            setGenerateKey(false);
            setAdvancedFormResponse(true)
        }

    };

    const handlePassphrase = (evt) => {
        const result = helper.ValidatePassphrase(evt.target.value);
        setPassphraseError(result)
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
                                <h3 className="heading">Import Wallet</h3>
                            </Modal.Header>
                            <div className="create-wallet-body import-wallet-body">
                                {
                                    importMnemonic ?
                                        <>
                                            <Form onSubmit={handleSubmit}>
                                                <div className="text-center">
                                                    <p onClick={() => handlePrivateKey(false)} className="import-name">Use
                                                        Private Key (KeyStore.json file)</p>
                                                </div>
                                                <div className="form-field">
                                                    <p className="label">Enter Mnemonic (Seed Phrase)</p>
                                                    <Form.Control as="textarea" rows={3} name="mnemonic"
                                                                  placeholder="Seed Phrase"
                                                                  required={true}/>
                                                </div>

                                                {errorMessage !== ''
                                                    ? <p className="form-error">{errorMessage}</p>
                                                    : null

                                                }
                                                <div className="buttons">
                                                    <button className="button button-primary" >Next</button>
                                                </div>

                                            </Form>
                                            <div className="buttons">
                                                <button className="button button-primary large" onClick={()=>handleRoute("withAddress")}>Continue without importing?</button>
                                            </div>
                                        </>

                                        : <Form onSubmit={handlePrivateKeySubmit}>
                                            <div className="text-center">
                                                <p onClick={() => handlePrivateKey(true)} className="import-name">Use
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
                                                           className="file-upload" accept=".json" required={true}/>
                                            </div>
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
                                                <p> Password decrypts your Private Key (KeyStore file).</p>
                                            </div>
                                        </Form>

                                }


                            </div>
                        </>
                        : null
                }
                {
                    advancedForm ?
                        <>
                            <Modal.Header closeButton>
                                <div className="previous-section">
                                    <button className="button" onClick={() => handlePrevious("advancedForm")}>
                                        <Icon
                                            viewClass="arrow-right"
                                            icon="left-arrow"/>
                                    </button>
                                </div>
                                <h3 className="heading">Import Wallet</h3>
                            </Modal.Header>
                            <div className="create-wallet-body import-wallet-body">
                                {errorMessage !== "" ?
                                    <div className="login-error"><p className="error-response">{errorMessage}</p></div>
                                    : <div>
                                        <div className="download-section">
                                            <div className="key-download" onClick={() => handleRoute('generateKey')}>
                                                <p> Generate KeyStore File</p>
                                                <Icon viewClass="arrow-icon" icon="left-arrow"/>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <Form onSubmit={handleSubmitAdvance}>
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
                                                            required={false}
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
                                                            required={false}
                                                        />
                                                    </div>
                                                    <div className="form-field passphrase-field">
                                                        <p className="label">bip39Passphrase</p>
                                                        <Form.Control
                                                            type="password"
                                                            name="bip39Passphrase"
                                                            maxLength="50"
                                                            id="bip39Passphrase"
                                                            placeholder="Enter bip39Passphrase (optional)"
                                                            onChange={handlePassphrase}
                                                            required={false}
                                                        />
                                                        {passphraseError ?
                                                            <span className="passphrase-error">Length should be below 50 characters</span>
                                                            : null}
                                                    </div>
                                                </>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>

                                    <div className="buttons">
                                        <button className="button button-primary">Next</button>
                                    </div>
                                </Form>
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
                {advancedFormResponse ?
                    <>
                        <Modal.Header closeButton>
                            <div className="previous-section">
                                <button className="button" onClick={() => handlePrevious("advancedFormResponse")}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                            </div>
                            <h3 className="heading">Import Wallet</h3>
                        </Modal.Header>
                        <div className="create-wallet-body create-wallet-form-body">
                            <p className="mnemonic-result"><b>Wallet path: </b>{advancedFormResponseData.walletPath}</p>
                            <p className="mnemonic-result"><b>Address: </b>{advancedFormResponseData.address}</p>
                            <div className="buttons">
                                <button className="button button-primary" onClick={handleLogin}>Done</button>
                            </div>
                            <div className="note-section">
                                <div className="exclamation"><Icon
                                    viewClass="arrow-right"
                                    icon="exclamation"/></div>
                                <p>Please securely store the wallet path for future use</p>
                            </div>

                        </div>
                    </>
                    : null}

            </Modal>
            {withAddress ?
                    <AddressImport mnemonic={props.mnemonic} handleRoute={handleRoute} handleClose={handleClose} setWithAddress={setWithAddress}
                                   routeValue="hideWithAddress"/>
                    : null
            }
            {generateKey ?
                <GeneratePrivateKey mnemonic={userMnemonic} handleRoute={handleRoute} setGenerateKey={setGenerateKey}
                                    routeValue="hideGenerateKey" formName="Import Wallet"/>
                : null
            }
            {showFaq
                ?
                <ModalFaq setShowFaq={setShowFaq}/>
                :
                null}
        </>

    );
};
export default ModalImportWallet;
