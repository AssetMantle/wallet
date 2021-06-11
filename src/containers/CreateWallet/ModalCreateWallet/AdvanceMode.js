import React, {useContext, useState} from "react";
import {
    Accordion, AccordionContext, Card,
    Form, Modal, useAccordionToggle,
} from "react-bootstrap";
import wallet from "../../../utils/wallet";
import Icon from "../../../components/Icon";
import GeneratePrivateKey from "../../Common/GeneratePrivateKey";
import helper from "../../../utils/helper";
import MakePersistence from "../../../utils/cosmosjsWrapper";
import config from "../../../config";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";

const AdvanceMode = (props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [advanceForm, setAdvanceForm] = useState(true);
    const [responseShow, setResponseShow] = useState(false);
    const [response, setResponse] = useState("");
    const [passphraseError, setPassphraseError] = useState(false);
    const [generateKey, setGenerateKey] = useState(false);
    const [advanceMode, setAdvanceMode] = useState(false);

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
        setResponseShow(true);
        setAdvanceForm(false);
        setAdvanceMode(false);
    };
    const handleRoute = (key) => {
        if (key === 'generateKey') {
            setGenerateKey(true);
            setShow(false);
        }
        if (key === "hideGenerateKey") {
            setGenerateKey(false);
            setShow(true);
        }
    };
    const handlePassphrase = (evt) => {
        const result = helper.validatePassphrase(evt.target.value);
        setPassphraseError(result);
    };
    const handleClose = () => {
        setShow(false);
        props.handleClose();
    };
    const handleLogin = () => {
        const persistence = MakePersistence(0, 0);
        persistence.getAccounts(response.address).then(data => {
            if (data.code === undefined) {
                if (data.account["@type"] === "/cosmos.vesting.v1beta1.PeriodicVestingAccount" ||
                    data.account["@type"] === "/cosmos.vesting.v1beta1.DelayedVestingAccount" ||
                    data.account["@type"] === "/cosmos.vesting.v1beta1.ContinuousVestingAccount") {
                    localStorage.setItem('fee', config.vestingAccountFee);
                    localStorage.setItem('account', 'vesting');
                } else {
                    localStorage.setItem('fee', config.defaultFee);
                    localStorage.setItem('account', 'non-vesting');
                }
            } else {
                localStorage.setItem('fee', config.defaultFee);
                localStorage.setItem('account', 'non-vesting');
            }
        });
        localStorage.setItem('loginToken', 'loggedIn');
        localStorage.setItem('address', response.address);
        localStorage.setItem('loginMode', 'normal');
        localStorage.setItem('version', config.version);
        setShow(false);
        props.handleClose();
        history.push('/dashboard/wallet');
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

    return (
        <>
            <Modal backdrop="static" show={show} onHide={handleClose} centered
                className="create-wallet-modal seed">
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
                            <h3 className="heading">{t("CREATE_WALLET")}</h3>
                        </Modal.Header>
                        <div className="create-wallet-body create-wallet-form-body">
                            <div className="key-download" onClick={() => handleRoute('generateKey')}>
                                <p>{t("GENERATE_KEY_STORE")}</p>
                                <Icon viewClass="arrow-icon" icon="left-arrow"/>
                            </div>
                            <Form onSubmit={handleSubmit} className="advancemode-form">
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
                                                        type="number"
                                                        min={0}
                                                        max={4294967295}
                                                        name="accountNumber"
                                                        id="createAccountNumber"
                                                        onKeyPress={handleKeypress}
                                                        placeholder={t("ACCOUNT_NUMBER")}
                                                        required={false}
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <p className="label">{t("ACCOUNT_INDEX")}</p>
                                                    <Form.Control
                                                        type="number"
                                                        min={0}
                                                        max={4294967295}
                                                        name="accountIndex"
                                                        id="createAccountIndex"
                                                        onKeyPress={handleKeypress}
                                                        placeholder={t("ACCOUNT_INDEX")}
                                                        required={false}
                                                    />
                                                </div>
                                                <div className="form-field passphrase-field">
                                                    <p className="label">{t("BIP_PASSPHRASE")}</p>
                                                    <Form.Control
                                                        type="password"
                                                        name="bip39Passphrase"
                                                        id="createbip39Passphrase"
                                                        maxLength="50"
                                                        onKeyPress={handleKeypress}
                                                        placeholder={t("ENTER_BIP_PASSPHRASE")}
                                                        onChange={handlePassphrase}
                                                        required={false}
                                                    />
                                                    {passphraseError ?
                                                        <span className="passphrase-error">{t("BIP_PASSPHRASE_ERROR")}</span>
                                                        : null}
                                                </div>

                                            </>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                                <div className="buttons">
                                    <button className="button button-primary">{t("NEXT")}
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
                            <h3 className="heading">{t("CREATE_WALLET")}</h3>
                        </Modal.Header>
                        <div className="create-wallet-body create-wallet-form-body">
                            <p className="mnemonic-result"><b>{t("WALLET_PATH")}: </b>{response.walletPath}</p>
                            <p className="mnemonic-result"><b>{t("ADDRESS")}: </b>{response.address}</p>
                            <div className="buttons">
                                <button className="button button-primary" onClick={handleLogin}>Login</button>
                            </div>
                            <div className="note-section">
                                <div className="exclamation"><Icon
                                    viewClass="arrow-right"
                                    icon="exclamation"/></div>
                                <p>{t("WALLET_PATH_WARNING")}</p>
                            </div>
                        </div>
                    </>
                    : null}
            </Modal>
            {generateKey ?
                <GeneratePrivateKey mnemonic={props.mnemonic} handleRoute={handleRoute} setGenerateKey={setGenerateKey} routeValue="hideGenerateKey" formName="Create Wallet"/>
                : null
            }
        </>
    );
};
export default AdvanceMode;
