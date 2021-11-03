import React, {useState} from "react";
import {
    Form, Modal
} from "react-bootstrap";
import Icon from "../../../components/Icon";
import helper from "../../../utils/helper";
import {useTranslation} from "react-i18next";
import transactions from "../../../utils/transactions";
import wallet from "../../../utils/wallet";
import AdvancedFields from "../../../components/AdvancedFields";


const ChangePassword = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [response, setResponse] = useState('');
    const [verifyModal, setVerifyModal] = useState(true);
    const [resetModal, setResetModal] = useState(false);
    const [advanceMode, setAdvanceMode] = useState(false);
    const [inputAccountNumber, setAccountNumber] = useState('');
    const [password, setPassword] = useState('');
    const [inputAccountIndex, setAccountIndex] = useState('');
    const [inputBip39Passphrase, setBip39Passphrase] = useState('');
    const [showDownload, setShowDownload] = useState(false);
    // const [keyFile, setKeyFile] = useState(false);

    const handleSubmit = async event => {
        console.log(inputAccountNumber, inputAccountIndex ,inputBip39Passphrase,advanceMode, "proops values");
        let fileInput =
            document.getElementById('resetPasswordFile');
        let filePath = fileInput.value;
        if(helper.fileTypeCheck(filePath)) {
            const password = event.target.password.value;
            event.preventDefault();
            const fileReader = new FileReader();
            fileReader.readAsText(event.target.uploadFile.files[0], "UTF-8");
            fileReader.onload = async event => {
                const res = JSON.parse(event.target.result);
                const decryptedData = helper.decryptStore(res, password);
                if (decryptedData.error != null) {
                    setErrorMessage(decryptedData.error);
                } else {
                    let mnemonic = helper.mnemonicTrim(decryptedData.mnemonic);
                    localStorage.setItem('encryptedMnemonic', event.target.result);
                    let accountNumber = 0;
                    let addressIndex = 0;
                    let bip39Passphrase = "";
                    if (advanceMode) {
                        accountNumber = inputAccountNumber;
                        addressIndex =  inputAccountIndex;
                        bip39Passphrase = inputBip39Passphrase;
                        if (accountNumber === "") {
                            accountNumber = 0;
                        }
                        if (addressIndex === "") {
                            addressIndex = 0;
                        }
                    }
                    const walletPath = transactions.makeHdPath(accountNumber, addressIndex);
                    const responseData = await wallet.createWallet(mnemonic, walletPath, bip39Passphrase);
                    setVerifyModal(false);
                    setResponse(responseData);
                    setResetModal(true);
                    console.log(responseData);
                    setErrorMessage("");
                }
            };
        }else{
            setErrorMessage("File type not supported");
        }
    };

    const handleSubmitPassword = (event) =>{
        event.preventDefault();
        if(helper.passwordValidation(password)) {
            setPassword(event.target.password.value);
            setShowDownload(true);
        }else {
            setErrorMessage("Password must be greater than 3 letters and no spaces allowed");
        }
    };
    const handleResetSubmit = async () => {
        const mnemonic = response.mnemonic;
        let encryptedData = helper.createStore(mnemonic, password);
        let jsonContent = JSON.stringify(encryptedData.Response);
        downloadFile(jsonContent);
    };

    const downloadFile = async (jsonContent) => {
        const json = jsonContent;
        const fileName = "KeyStore";
        const blob = new Blob([json], {type: 'application/json'});
        const href = await URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClose = () => {
        setShow(false);
        props.handleRoute(props.routeValue);
        if(props.formName === "Generate KeyStore File"){
            props.handleClose();
        }
    };
    const handlePrevious = (formName) => {
        if (formName === "generateKey") {
            setShow(false);
            props.setChangePassword(false);
            props.handleRoute(props.routeValue);
        }else if(formName === "download"){
            setResetModal(false);
            setVerifyModal(true);
        }
    };
    return (
        <Modal backdrop="static" show={show} onHide={handleClose} centered className="create-wallet-modal seed">
            {verifyModal ?
                <>
                    <Modal.Header closeButton>
                        <div className="previous-section">
                            <button className="button" onClick={() => handlePrevious("generateKey")}>
                                <Icon
                                    viewClass="arrow-right"
                                    icon="left-arrow"/>
                            </button>
                        </div>
                        <h3 className="heading"> {t("KEYSTORE_PASSWORD_RESET")}</h3>
                    </Modal.Header>
                    <div className="create-wallet-body create-wallet-form-body">
                        <Form onSubmit={handleSubmit}>
                            <div className="form-field upload">
                                <p className="label"> {t("KEY_STORE_FILE")}</p>
                                <Form.File id="resetPasswordFile" name="uploadFile"
                                    className="file-upload" accept=".json" required={true}/>
                            </div>

                            <div className="form-field">
                                <p className="label"> {t("CURRENT_PASSWORD")}</p>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder={t("ENTER_PASSWORD")}
                                    required={true}
                                />
                            </div>

                            <AdvancedFields
                                advanceMode={advanceMode}
                                setAccountNumber={setAccountNumber}
                                setAccountIndex={setAccountIndex}
                                setAdvanceMode={setAdvanceMode}
                                setBip39Passphrase={setBip39Passphrase}
                            />
                            {
                                errorMessage !== "" ?
                                    <p className="form-error">{errorMessage}</p>
                                    : null
                            }
                            <div className="buttons">
                                <button className="button button-primary" >{t("SUBMIT")}</button>
                            </div>
                            {/*<div className="note-section">*/}
                            {/*    <div className="exclamation"><Icon*/}
                            {/*        viewClass="arrow-right"*/}
                            {/*        icon="exclamation"/></div>*/}
                            {/*    <p>{t("PRIVATE_KEY_PASSWORD_NOTE")}</p>*/}
                            {/*</div>*/}
                        </Form>
                    </div>
                </>
                : ""
            }
            {
                resetModal ?
                    <>
                        <Modal.Header closeButton>
                            <div className="previous-section">
                                <button className="button" onClick={() => handlePrevious("download")}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                            </div>
                            <h3 className="heading">{t("KEYSTORE_PASSWORD_RESET")}</h3>
                        </Modal.Header>
                        <div className="create-wallet-body import-wallet-body">

                            {/*<p className="mnemonic-result"><b>{t("WALLET_PATH")}: </b>{response.walletPath}</p>*/}

                            {
                                !showDownload ?
                                    <>
                                        <Form onSubmit={handleSubmitPassword} className="form-privatekey">

                                            <div className="form-field">
                                                <p className="label"> {t("ADDRESS")}</p>
                                                <p className="info-data">
                                                    {response.address}
                                                </p>
                                            </div>
                                            <div className="form-field">
                                                <p className="label"> {t("ENTER_NEW_PASSWORD")}</p>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder={t("ENTER_NEW_PASSWORD")}
                                                    required={true}
                                                />
                                            </div>
                                            {errorMessage !== "" ?
                                                <div className="login-error"><p className="error-response">{errorMessage}</p></div>
                                                : ""
                                            }
                                            <div className="buttons">
                                                <button className="button button-primary">{t("SUBMIT")}</button>
                                            </div>
                                        </Form>
                                    </>
                                    :
                                    <>
                                        <div className="download-keystore-box">
                                            <p onClick={handleResetSubmit}>Download New KeyStore File</p>
                                        </div>
                                        <div className="note-section">
                                            <div className="exclamation"><Icon
                                                viewClass="arrow-right"
                                                icon="exclamation"/></div>
                                            <p>{t("PRIVATE_KEY_PASSWORD_NOTE")}</p>
                                        </div>
                                    </>
                            }
                        </div>
                    </>
                    : null
            }
        </Modal>
    );
};
export default ChangePassword;
