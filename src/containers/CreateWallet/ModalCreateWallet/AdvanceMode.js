import React, {useContext, useState} from "react";
import {
    Form,
} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import wallet from "../../../utils/wallet";
import Icon from "../../../components/Icon";
import GeneratePrivateKey from "../../ImpotWallet/GeneratePrivateKey";
import helper from "../../../utils/helper";

const AdvanceMode = (props) => {
    const [show, setShow] = useState(true);
    const [mode, setMode] = useState("default");
    const [response, setResponse] = useState("");
    const [passphraseError, setPassphraseError] = useState(false);
    const [generateKey, setGenerateKey] = useState(false);
    const history = useHistory();
    const handleRadioChange = evt => {
        setMode(evt.target.value)
        if (evt.target.value === "default") {
            document.getElementById('createAccountNumber').value = 0;
            document.getElementById('createAccountIndex').value = 0;
            document.getElementById('createbip39Passphrase').value = "";
        }
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        let accountNumber = document.getElementById('createAccountNumber').value;
        let addressIndex = document.getElementById('createAccountIndex').value;
        let bip39Passphrase = document.getElementById('createbip39Passphrase').value;
        const walletPath = wallet.getWalletPath(accountNumber, addressIndex);
        const responseData = wallet.createWallet(props.mnemonic, walletPath, bip39Passphrase);
        setResponse(responseData)
        setShow(false)
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
    return (
        <>
            {show ?
                <div>
                    <div className="key-download" onClick={() => handleRoute('generateKey')}>
                        <p>Generate Keystore File</p>
                        <Icon viewClass="arrow-icon" icon="left-arrow"/>
                    </div>
                    <div className="radio-group">
                        <Form.Check
                            custom
                            type="radio"
                            value="default"
                            label="Default"
                            id="defaultPath"
                            checked={mode === "default"}
                            onChange={handleRadioChange}
                        />
                        <Form.Check
                            custom
                            type="radio"
                            value="advance"
                            label="Advance"
                            checked={mode === "advance"}
                            id="advancePath"
                            onChange={handleRadioChange}
                        />
                    </div>
                    <Form onSubmit={handleSubmit} className="advancemode-form">
                        <div className="form-field">
                            <p className="label">Account</p>
                            <Form.Control
                                type="number"
                                min={0}
                                max={4294967295}
                                name="accountNumber"
                                id="createAccountNumber"
                                defaultValue={mode === "default" ? 0 : " "}
                                placeholder="Account number"
                                required={true}
                                disabled={mode === "default" ? true : false}
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
                                defaultValue={mode === "default" ? 0 : ""}
                                placeholder="Account Index"
                                required={true}
                                disabled={mode === "default" ? true : false}
                            />
                        </div>
                        <div className="form-field passphrase-field">
                            <p className="label">bip39Passphrase</p>
                            <Form.Control
                                type="password"
                                name="bip39Passphrase"
                                id="createbip39Passphrase"
                                maxlength="50"
                                defaultValue={mode === "default" ? "" : ""}
                                placeholder="Enter bip39Passphrase (optional)"
                                onChange={handlePassphrase}
                                required={false}
                                disabled={mode === "default" ? true : false}
                            />
                            {passphraseError ?
                                <span className="passphrase-error">Length should be below 50 characters</span>
                                : null}
                        </div>
                        <div className="buttons">
                            <button className="button button-primary">Next
                            </button>
                        </div>
                    </Form>
                </div>
                : null}
            {response !== "" ?
                <div>
                    <p className="mnemonic-result"><b>wallet path: </b>{response.walletPath}</p>
                    <p className="mnemonic-result"><b>address: </b>{response.address}</p>
                </div>
                : null}
            {generateKey ?
                <GeneratePrivateKey mnemonic={props.mnemonic} handleRoute={handleRoute} routeValue="hideGenerateKey"/>
                : null
            }
        </>
    );
};
export default AdvanceMode;
