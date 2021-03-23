import React, {useState} from "react";
import {
    Form,
} from "react-bootstrap";
import Icon from "../../components/Icon";
import DownloadLink from "react-download-link";
import helper from "../../utils/helper";


const GeneratePrivateKey = (props) => {
    const [jsonName, setJsonName] = useState({});
    const [keyFile, setKeyFile] = useState(false);
    const handleSubmit = async event => {
        event.preventDefault();
        const password = event.target.password.value;
        const mnemonic = props.mnemonic;
        let encryptedData = helper.createStore(mnemonic, password);
        let jsonContent = JSON.stringify(encryptedData.Response);
        setJsonName(jsonContent);
        setKeyFile(true)
    };

    return (
        <div className="create-wallet-body">
            <Form onSubmit={handleSubmit} className="form-privatekey">
                {!keyFile ?
                    <div className="form-field">
                        <p className="label">Password</p>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            required={true}
                        />
                    </div>
                    : null
                }
                {keyFile ?
                    <div className="download-section">
                        <div className="key-download">
                            <DownloadLink
                                label="Download Key Store File"
                                filename="KeyStore.json"
                                exportFile={() => `${jsonName}`}
                            />
                            <Icon viewClass="download-icon" icon="download"/>
                        </div>
                    </div>
                    : null}

                {!keyFile ?

                    <>
                        <div className="buttons">
                            <button className="button button-secondary"
                                    onClick={() => props.handleRoute(props.routeValue)}>
                                <Icon
                                    viewClass="arrow-right"
                                    icon="left-arrow"/>
                            </button>
                            <button className="button button-primary">Submit</button>
                        </div>
                        <div className="note-section">
                            <div className="exclamation"><Icon
                                viewClass="arrow-right"
                                icon="exclamation"/></div>
                            <p>Password for encrypts your private key. This does not act as a seed to
                                generate your seed.</p>
                        </div>
                    </>
                    :
                    null
                }


            </Form>
            {keyFile ?
                <>
                    <div className="buttons">
                        <button className="button button-secondary" onClick={() => props.handleRoute(props.routeValue)}>
                            <Icon
                                viewClass="arrow-right"
                                icon="left-arrow"/>
                        </button>
                        <button className="button button-primary" onClick={props.handleClose}>Done</button>
                    </div>
                    <div className="note-section">
                        <div className="exclamation"><Icon
                            viewClass="arrow-right"
                            icon="exclamation"/></div>
                        <p>This is your Key Store json file. Please secure in a safe place</p>
                    </div>

                </>
                : null
            }

        </div>

    );
};
export default GeneratePrivateKey;
