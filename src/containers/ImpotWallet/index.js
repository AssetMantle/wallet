import React, {useState} from "react";
import {Form, OverlayTrigger, Popover} from "react-bootstrap";
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

    const handleSubmit = async event => {
        const password = event.target.password.value;
        event.preventDefault();
        setMnemonicForm(false);
        setResponseDataShow(true)
        const responseData = wallet.createWallet(event.target.mnemonic.value);
        setResponse(responseData);
        let mnemonic = responseData.mnemonic;
        const mnemonicArray = mnemonic.split(' ');
        setMnemonicList(mnemonicArray);
        if (responseData.error) {
            setErrorMessage(responseData.error);
        } else {
            let encryptedData = helper.createStore(responseData.mnemonic, password);
            let jsonContent = JSON.stringify(encryptedData);
            setJsonName(jsonContent);
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
                const responseData = wallet.createWallet(error.mnemonic);
                setResponse(responseData);
                if (responseData.error) {
                    setErrorMessage(responseData.error);
                } else {
                    let mnemonic = responseData.mnemonic;
                    const mnemonicArray = mnemonic.split(' ');
                    setMnemonicList(mnemonicArray);
                    let encryptedData = helper.createStore(responseData.mnemonic, password);
                    let jsonContent = JSON.stringify(encryptedData);
                    setJsonName(jsonContent);
                    setResponseDataShow(true);
                    setMnemonicForm(false);
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
                                    <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
                                        <button className="icon-button info"><Icon
                                            viewClass="arrow-right"
                                            icon="info"/></button>
                                    </OverlayTrigger>
                                </h3>
                                {
                                    importMnemonic ?
                                        <Form onSubmit={handleSubmit}>
                                            <p onClick={() => handlePrivateKey(false)} className="import-name">Use
                                                private key file</p>
                                            <div className="form-field">
                                                <p className="label">Password</p>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder="Enter Your Wallet Password"
                                                    required={true}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">Enter Seed</p>
                                                <Form.Control as="textarea" rows={5} name="mnemonic"
                                                              placeholder="Enter Seed"
                                                              required={true}/>
                                            </div>
                                            <div className="buttons">
                                                <button className="button button-primary">Next</button>
                                            </div>
                                            <div className="note-section">
                                                <div className="exclamation"><Icon
                                                    viewClass="arrow-right"
                                                    icon="exclamation"/></div>
                                                <p>This is your key json file. Please secure in a safe place</p>
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
                                                    placeholder="Enter Your Wallet Password"
                                                    required={true}
                                                />
                                            </div>
                                            <div className="form-field upload">
                                                <p className="label">Upload key file</p>
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
                                                <p>This is your key json file. Please secure in a safe place</p>
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
                                    <div className="menmonic-list">
                                        {mnemonicList.map((key, index) => {
                                            return (
                                                <Form.Control
                                                    key={index}
                                                    type="text"
                                                    value={key}
                                                    required={true}
                                                />
                                            )
                                        })
                                        }
                                    </div>
                                    <p className="mnemonic-result"><b>wallet path: </b>{response.walletPath}</p>
                                    <p className="mnemonic-result"><b>address: </b>{response.address}</p>
                                    <div className="download-section">
                                        <p className="name">Private Key:</p>
                                        <div className="key-download">
                                            <DownloadLink
                                                label="Download Key File for future use"
                                                filename="key.json"
                                                exportFile={() => `${jsonName}`}
                                            />
                                            <Icon viewClass="arrow-icon" icon="left-arrow"/>
                                        </div>
                                    </div>
                                </div>
                            }

                            <div className="buttons">
                                <button className="button button-primary" onClick={handleLogin}>Next</button>
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
