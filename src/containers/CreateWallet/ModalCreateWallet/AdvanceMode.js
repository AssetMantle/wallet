import React, {useContext, useState} from "react";
import {
    Accordion, AccordionContext, Card,
    Form, Modal, useAccordionToggle,
} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import wallet from "../../../utils/wallet";
import Icon from "../../../components/Icon";
import GeneratePrivateKey from "../../ImpotWallet/GeneratePrivateKey";
import helper from "../../../utils/helper";

const AdvanceMode = (props) => {
    const [show, setShow] = useState(true);
    const [advanceForm, setAdvanceForm] = useState(true);
    const [responseShow, setResponseShow] = useState(false);
    const [response, setResponse] = useState("");
    const [passphraseError, setPassphraseError] = useState(false);
    const [generateKey, setGenerateKey] = useState(false);
    const [advanceMode, setAdvanceMode] = useState(false);
    const history = useHistory();

    const handleSubmit = (event) => {
        event.preventDefault();
        let accountNumber = 0;
        let addressIndex = 0;
        let bip39Passphrase = "";
        if(advanceMode){
            accountNumber = document.getElementById('createAccountNumber').value;
            addressIndex = document.getElementById('createAccountIndex').value;
            bip39Passphrase = document.getElementById('createbip39Passphrase').value;
            if(accountNumber === ""){
                accountNumber = 0;
            }
            if(addressIndex === ""){
                addressIndex = 0;
            }
        }

        const walletPath = wallet.getWalletPath(accountNumber, addressIndex);
        const responseData = wallet.createWallet(props.mnemonic, walletPath, bip39Passphrase);
        setResponse(responseData);
        setResponseShow(true)
        setAdvanceForm(false);
        setAdvanceMode(false);
    };
    const handleRoute = (key) => {
        if (key === 'generateKey') {
            setGenerateKey(true);
            setShow(false)
        }
        if (key === "hideGenerateKey") {
            setGenerateKey(false);
            setShow(true)
        }
    };
    const handlePassphrase = (evt) => {
        const result = helper.ValidatePassphrase(evt.target.value);
        setPassphraseError(result)
    };
    const handleClose = () => {
        setShow(false);
        props.handleClose();
    };
    const handlePrevious = (formName) => {
        if(formName === "advanceForm"){
            setAdvanceForm(false);
            props.setAccountInfo(false);
            props.setShow(true);
            props.setMnemonicQuiz(true);
        }
        if(formName === "response"){
            setAdvanceForm(true);
            setResponseShow(false);
        }
    };

    const handleKeypress = e => {
        if (e.key === "Enter") {
            handleSubmit(e);
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

    return (
        <>
            <Modal backdrop="static" show={show} onHide={handleClose} centered
                   className="create-wallet-modal large seed">
                {advanceForm ?
                    <>
                        <Modal.Header closeButton>
                            <div className="previous-section">
                                <button className="button" onClick={() => handlePrevious("advanceForm")}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                            </div>
                            <h3 className="heading">Creating New Wallet</h3>
                        </Modal.Header>
                        <div className="create-wallet-body create-wallet-form-body">
                            <div className="key-download" onClick={() => handleRoute('generateKey')}>
                                <p>Generate Keystore File</p>
                                <Icon viewClass="arrow-icon" icon="left-arrow"/>
                            </div>
                            <Form onSubmit={handleSubmit} className="advancemode-form">
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
                                                    id="createAccountNumber"
                                                    onKeyPress={handleKeypress}
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
                                                    id="createAccountIndex"
                                                    onKeyPress={handleKeypress}
                                                    placeholder="Account Index"
                                                    required={false}
                                                />
                                            </div>
                                            <div className="form-field passphrase-field">
                                                <p className="label">bip39Passphrase</p>
                                                <Form.Control
                                                    type="password"
                                                    name="bip39Passphrase"
                                                    id="createbip39Passphrase"
                                                    maxlength="50"
                                                    onKeyPress={handleKeypress}
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
                                    <button className="button button-primary">Next
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </>
                    : null
                }
                {responseShow ?
                    <>
                    <Modal.Header closeButton>
                        <div className="previous-section">
                            <button className="button" onClick={() => handlePrevious("response")}>
                                <Icon
                                    viewClass="arrow-right"
                                    icon="left-arrow"/>
                            </button>
                        </div>
                        <h3 className="heading">Creating New Wallet</h3>
                    </Modal.Header>
                    <div className="create-wallet-body create-wallet-form-body">
                        <p className="mnemonic-result"><b>Wallet path: </b>{response.walletPath}</p>
                        <p className="mnemonic-result"><b>Address: </b>{response.address}</p>
                        <div className="buttons">
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
                    : null}
            </Modal>
            {generateKey ?
                <GeneratePrivateKey mnemonic={props.mnemonic} handleRoute={handleRoute} setGenerateKey={setGenerateKey} routeValue="hideGenerateKey" formName="Creating New Wallet"/>
                : null
            }
        </>
    );
};
export default AdvanceMode;
