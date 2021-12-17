import React, {useContext, useState} from "react";
import {Accordion, AccordionContext, Card, Form, Modal, useAccordionToggle} from "react-bootstrap";
import Icon from "../../components/Icon";
import wallet from "../../utils/wallet";
import helper from "../../utils/helper";
import GeneratePrivateKey from "../KeyStore/GenerateKeyStore/GeneratePrivateKey";
import {useTranslation} from "react-i18next";
import transactions from "../../utils/transactions";
import config from "../../config";

const ModalImportWallet = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [userMnemonic, setUserMnemonic] = useState("");
    const [passphraseError, setPassphraseError] = useState(false);
    const [mnemonicForm, setMnemonicForm] = useState(true);
    const [advancedForm, setAdvancedForm] = useState(false);
    const [advancedFormResponseData, setAdvancedFormResponseData] = useState("");
    const [advancedFormResponse, setAdvancedFormResponse] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [advanceMode, setAdvanceMode] = useState(false);
    const [generateKey, setGenerateKey] = useState(false);
    const [privateAdvanceMode, setPrivateAdvanceMode] = useState(false);

    const handlePrivateKeySubmit = async event => {
        let fileInput =
            document.getElementById('importDecryptFile');
        let filePath = fileInput.value;
        if (helper.fileTypeCheck(filePath)) {
            const password = event.target.password.value;
            event.preventDefault();
            const fileReader = new FileReader();
            fileReader.readAsText(event.target.uploadFile.files[0], "UTF-8");
            fileReader.onload = event => {
                const res = JSON.parse(event.target.result);
                const decryptedData = helper.decryptStore(res, password);
                if (decryptedData.error != null) {
                    setErrorMessage(decryptedData.error);
                } else {
                    let mnemonic = helper.mnemonicTrim(decryptedData.mnemonic);
                    localStorage.setItem('encryptedMnemonic', event.target.result);
                    setUserMnemonic(mnemonic);
                    setAdvancedForm(true);
                    setMnemonicForm(false);
                    setErrorMessage("");
                }
            };
        } else {
            setErrorMessage("File type not supported");
        }
    };

    const handleRoute = (key) => {
        if (key === "generateKey") {
            setGenerateKey(true);
            setAdvancedForm(false);
        }
        if (key === "hideGenerateKey") {
            setGenerateKey(false);
            setAdvancedForm(true);
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

    const handleSubmitAdvance = async (event) => {
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
        const walletPath = transactions.makeHdPath(accountNumber, addressIndex);
        const responseData = await wallet.createWallet(userMnemonic, walletPath, bip39Passphrase);
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
            setAdvancedFormResponse(false);
        } else if (formName === "generateKey") {
            setGenerateKey(false);
            setAdvancedFormResponse(true);
        }

    };

    const handlePassphrase = (evt) => {
        const result = helper.validatePassphrase(evt.target.value);
        setPassphraseError(result);
    };

    const handleClose = () => {
        setShow(false);
        if (props.name === "createWallet") {
            props.setShowImportWallet(false);
            props.handleClose();
        } else if (props.name === "homepage") {
            props.setRoutName("");
        }
    };

    return (
        <>
            <Modal backdrop="static" show={show} onHide={handleClose} centered
                className="create-wallet-modal seed">
                {
                    mnemonicForm ?
                        <>
                            <Modal.Header closeButton>
                                <h3 className="heading">{t("IMPORT_WALLET")}</h3>
                            </Modal.Header>
                            <div className="create-wallet-body import-wallet-body">
                                <Form onSubmit={handlePrivateKeySubmit}>
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
                                        <p className="label"> {t("KEY_STORE_FILE")}</p>
                                        <Form.File id="importDecryptFile" name="uploadFile"
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
                                        <p>{t("PRIVATE_KEY_WARNING")}</p>
                                    </div>
                                </Form>


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
                                <h3 className="heading">{t("IMPORT_WALLET")}</h3>
                            </Modal.Header>
                            <div className="create-wallet-body import-wallet-body">
                                {errorMessage !== "" ?
                                    <div className="login-error"><p className="error-response">{errorMessage}</p></div>
                                    : <div>
                                        <div className="download-section">
                                            <div className="key-download" onClick={() => handleRoute('generateKey')}>
                                                <p>{t("GENERATE_KEY_STORE")}</p>
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
                                                    {t("ADVANCED")}
                                                </p>
                                                <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <>
                                                    <div className="form-field">
                                                        <p className="label"> {t("ACCOUNT")}</p>
                                                        <Form.Control
                                                            type="number"
                                                            max={config.maxAccountNumber}
                                                            name="accountNumber"
                                                            id="accountNumber"
                                                            placeholder={t("ACCOUNT_NUMBER")}
                                                            required={false}
                                                        />
                                                    </div>
                                                    <div className="form-field">
                                                        <p className="label">{t("ACCOUNT_INDEX")}</p>
                                                        <Form.Control
                                                            type="number"
                                                            max={config.maxAccountNumber}
                                                            name="accountIndex"
                                                            id="accountIndex"
                                                            placeholder={t("ACCOUNT_INDEX")}
                                                            required={false}
                                                        />
                                                    </div>
                                                    <div className="form-field passphrase-field">
                                                        <p className="label">{t("BIP_PASSPHRASE")}</p>
                                                        <Form.Control
                                                            type="password"
                                                            name="bip39Passphrase"
                                                            maxLength="50"
                                                            id="bip39Passphrase"
                                                            placeholder={t("ENTER_BIP_PASSPHRASE")}
                                                            onChange={handlePassphrase}
                                                            required={false}
                                                        />
                                                        {passphraseError ?
                                                            <span
                                                                className="passphrase-error">{t("BIP_PASSPHRASE_ERROR")}</span>
                                                            : null}
                                                    </div>
                                                </>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>

                                    <div className="buttons">
                                        <button className="button button-primary">{t("NEXT")}</button>
                                    </div>
                                </Form>

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
                            <h3 className="heading">{t("IMPORT_WALLET")}</h3>
                        </Modal.Header>
                        <div className="create-wallet-body create-wallet-form-body">
                            <p className="mnemonic-result">
                                <b>{t("WALLET_PATH")}: </b>{advancedFormResponseData.walletPath}</p>
                            <p className="mnemonic-result"><b>{t("ADDRESS")}: </b>{advancedFormResponseData.address}</p>
                            <div className="buttons">
                                <button className="button button-primary" onClick={handleClose}>{t("DONE")}</button>
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
                <GeneratePrivateKey mnemonic={userMnemonic} handleRoute={handleRoute} setGenerateKey={setGenerateKey}
                    routeValue="hideGenerateKey" formName="Import Wallet"/>
                : null
            }
        </>

    );
};
export default ModalImportWallet;
