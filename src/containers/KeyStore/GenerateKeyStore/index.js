import React, {useState} from "react";
import {
    Form,
    Modal
} from "react-bootstrap";
import wallet from "../../../utils/wallet";
import GeneratePrivateKey from "../../Common/GeneratePrivateKey";
import {useTranslation} from "react-i18next";
import helper from "../../../utils/helper";

const GenerateKeyStore = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [userMnemonic, setUserMnemonic] = useState("");
    const [mnemonicForm, setMnemonicForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [generateKey, setGenerateKey] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault();
        const responseData = wallet.createWallet(event.target.mnemonic.value);
        if (responseData.error) {
            setErrorMessage(responseData.error);
        } else {
            let mnemonic = helper.mnemonicTrim(event.target.mnemonic.value);
            setUserMnemonic(mnemonic);
            setGenerateKey(true);
            setMnemonicForm(false);
            setErrorMessage("");
            setShow(false);
        }
    };

    const handleRoute = (key) => {
        if (key === "generateKey") {
            setGenerateKey(true);
        }
        if (key === "hideGenerateKeyStore") {
            setGenerateKey(false);
            setMnemonicForm(true);
            setShow(true);
        }

    };


    const handleClose = () => {
        setShow(false);
        props.setShowKeyStore(false);
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
                                <h3 className="heading">Generate KeyStore File</h3>
                            </Modal.Header>
                            <div className="create-wallet-body import-wallet-body">
                                <Form onSubmit={handleSubmit}>
                                    <div className="form-field">
                                        <p className="label">{t("ENTER_MNEMONIC")}</p>
                                        <Form.Control as="textarea" rows={3} name="mnemonic"
                                            placeholder={t("SEED_PHRASE")}
                                            required={true}/>
                                    </div>

                                    {errorMessage !== ''
                                        ? <p className="form-error">{errorMessage}</p>
                                        : null

                                    }

                                    <div className="buttons">
                                        <button className="button button-primary">{t("NEXT")}</button>
                                    </div>
                                </Form>

                            </div>
                        </>
                        : null
                }

            </Modal>

            {generateKey ?
                <GeneratePrivateKey mnemonic={userMnemonic} handleRoute={handleRoute} setGenerateKey={setGenerateKey}
                    routeValue="hideGenerateKeyStore" formName="Generate KeyStore File" handleClose={handleClose}/>
                : null
            }
        </>

    );
};
export default GenerateKeyStore;
