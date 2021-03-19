import React, {useState, useEffect} from "react";
import {Modal, Form, Button, OverlayTrigger, Popover} from "react-bootstrap";
import Icon from "../../components/Icon";
import wallet from "../../utils/wallet";
import DownloadLink from "react-download-link";
import helper from "../../utils/helper"
import {useHistory} from "react-router-dom";
const ImportWallet = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [mnemonicForm, setMnemonicForm] = useState(true);
    const [responseDataShow, setResponseDataShow] = useState(false);
    const [passwordForm, setPasswordForm] = useState(false);
    const [response, setResponse] = useState("");
    const [jsonName, setJsonName] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const handleClose = () => {
        setShow(false);
        props.setRoutName("");
    };
    const handleSubmit = async event => {
        const password = event.target.password.value;
        event.preventDefault();
        setMnemonicForm(false);
        setResponseDataShow(true)
        const responseData = wallet.createWallet(event.target.mnemonic.value);
        setResponse(responseData);
        if (responseData.error) {
            setErrorMessage(responseData.error);
        }else{
            let encryptedData = helper.createStore(responseData.mnemonic, password);
            let jsonContent = JSON.stringify(encryptedData);
            setJsonName(jsonContent);
        }
    };
    const handleLogin = () =>{
        setShow(false);
        if (errorMessage === "") {
            localStorage.setItem('loginToken', 'loggedIn');
            localStorage.setItem('address', response.address);
            history.push('/dashboard/wallet');
        }
    };
    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                If you wish to import an already existing Persistence wallet, click on import an already existing wallet.
            </Popover.Content>
        </Popover>
    );
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered className="create-wallet-modal">
                {
                    mnemonicForm ?
                        <>
                            <Modal.Body className="create-wallet-body import-wallet-body">
                                <h3 className="heading">Importing Wallet
                                    <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
                                        <button className="icon-button info"><Icon
                                            viewClass="arrow-right"
                                            icon="info"/></button>
                                    </OverlayTrigger>
                                </h3>
                                <Form onSubmit={handleSubmit}>
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
                                </Form>

                            </Modal.Body>
                        </>
                        : null
                }
                {
                    responseDataShow ?
                        <Modal.Body className="create-wallet-body import-wallet-body">
                            <h3 className="heading">Importing Wallet</h3>
                            {errorMessage !== "" ?
                                <div className="login-error"><p className="error-response">{errorMessage}</p></div>
                                : <div>
                                    <p><b>mnemonic: </b>{response.mnemonic}</p>
                                    <p><b>wallet path: </b>{response.walletPath}</p>
                                    <p><b>address: </b>{response.address}</p>
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
                        </Modal.Body>
                        : null
                }
                {
                    passwordForm ?
                        <Modal.Body className="create-wallet-body import-wallet-body">
                            <h3 className="heading">Importing Wallet</h3>
                            <Form>
                                <p className="label">Enter Password</p>
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        name="amount"
                                        placeholder="Enter Your Wallet Password"
                                        required={true}
                                    />
                                </Form.Group>
                                <div className="buttons">
                                    <button className="button button-primary" >Login</button>
                                </div>
                            </Form>

                        </Modal.Body>
                        : null
                }
            </Modal>

        </div>

    );
};
export default ImportWallet;
