import React, {useContext, useState} from "react";
import {
    Form,
    OverlayTrigger,
    Popover,
    Accordion,
    Card,
    Button,
    AccordionContext,
    useAccordionToggle
} from "react-bootstrap";
import Icon from "../../components/Icon";
import wallet from "../../utils/wallet";
import DownloadLink from "react-download-link";
import helper from "../../utils/helper"
import {useHistory} from "react-router-dom";
import HomepageHeader from "../Common/HomepageHeader";
import ModalFaq from "../Faq";

const ImportWallet = (props) => {
    const history = useHistory();
    const [showFaq, setShowFaq] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [mnemonicForm, setMnemonicForm] = useState(true);
    const [mnemonicList, setMnemonicList] = useState('');
    const [responseDataShow, setResponseDataShow] = useState(false);
    const [response, setResponse] = useState("");
    const [jsonName, setJsonName] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [advanceMode, setAdvanceMode] = useState(false);
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
            const error = helper.decryptStore(res, password);
            if (error.error != null) {
                setErrorMessage(error.error)
            } else {
                let responseData;
                if (advanceMode) {
                    let accountNumber = document.getElementById('privateAccountNumber').value;
                    let addressIndex = document.getElementById('privateAccountIndex').value;
                    let bip39Passphrase = document.getElementById('bip39Passphrase').value;
                    const walletPath = wallet.getWalletPath(accountNumber, addressIndex);
                    responseData = wallet.createWallet(error.mnemonic, walletPath, bip39Passphrase);
                } else {
                    responseData = wallet.createWallet(error.mnemonic);
                }
                if (responseData.error) {
                    setErrorMessage(responseData.error);
                } else {
                    let mnemonic = responseData.mnemonic;
                    const mnemonicArray = mnemonic.split(' ');
                    setMnemonicList(mnemonicArray);
                    let encryptedData = helper.createStore(responseData.mnemonic, password);
                    let jsonContent = JSON.stringify(encryptedData);
                    setJsonName(jsonContent);
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
    const handleRoute = () =>{
        history.push("/")
    }
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
    }
    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                If you wish to import an already existing Persistence wallet, click on import an already existing
                wallet.
            </Popover.Content>
        </Popover>
    );
    return (
        <div className="create-wallet-section">
            <HomepageHeader/>
            <div className="create-wallet-modal large">
                {
                    mnemonicForm ?
                        <>
                            <div className="create-wallet-body import-wallet-body">
                                <h3 className="heading">Importing Wallet
                                    {/*      <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
                                        <button className="icon-button info"><Icon
                                            viewClass="arrow-right"
                                            icon="info"/></button>
                                    </OverlayTrigger>*/}
                                </h3>
                                {
                                    importMnemonic ?
                                        <Form onSubmit={handleSubmit}>
                                            <p onClick={() => handlePrivateKey(false)} className="import-name">Use
                                                private key file</p>
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
                                                                    type="text"
                                                                    name="accountNumber"
                                                                    id="accountNumber"
                                                                    placeholder="Account number"
                                                                    required={advanceMode ? true : false}
                                                                />
                                                            </div>
                                                            <div className="form-field">
                                                                <p className="label">Account Index</p>
                                                                <Form.Control
                                                                    type="text"
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
                                            <p onClick={() => handlePrivateKey(true)} className="import-name">Use
                                                Mnemonic</p>
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
                                                <p className="label">Upload key file</p>
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
                                                                    type="text"
                                                                    name="privateAccountNumber"
                                                                    id="privateAccountNumber"
                                                                    placeholder="Account number"
                                                                    required={privateAdvanceMode ? true : false}
                                                                />
                                                            </div>
                                                            <div className="form-field">
                                                                <p className="label">Account Index</p>
                                                                <Form.Control
                                                                    type="text"
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
                        <div className="create-wallet-body import-wallet-body">
                            <h3 className="heading">Importing Wallet</h3>
                            {errorMessage !== "" ?
                                <div className="login-error"><p className="error-response">{errorMessage}</p></div>
                                : <div>
                                    <p className="mnemonic-result"><b>wallet path: </b>{response.walletPath}</p>
                                    <p className="mnemonic-result"><b>address: </b>{response.address}</p>
                                </div>
                            }

                            <div className="buttons">
                                <button className="button button-secondary" onClick={() => handlePrevious(2)}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                                <button className="button button-primary" onClick={handleRoute}>Done</button>
                            </div>

                        </div>
                        : null
                }

            </div>
            {showFaq
                ?
                <ModalFaq setShowFaq={setShowFaq}/>
                :
                null}
        </div>

    );
};
export default ImportWallet;
