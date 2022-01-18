import React, {useState} from "react";
import {Form, Modal} from "react-bootstrap";
import wallet from "../../../utils/wallet";
import GeneratePrivateKey from "./GeneratePrivateKey";
import ChangePassword from "./ChangePassword";
import {useTranslation} from "react-i18next";
import helper from "../../../utils/helper";
import {ValidateStringSpaces} from "../../../utils/validations";

const GenerateKeyStore = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [userMnemonic, setUserMnemonic] = useState("");
    const [mnemonicForm, setMnemonicForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [generateKey, setGenerateKey] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault();
        const responseData = await wallet.createWallet(event.target.mnemonic.value);
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
        } else if (key === "hideGenerateKeyStore") {
            setGenerateKey(false);
            setMnemonicForm(true);
            setShow(true);
        } else if (key === "changePassword") {
            setChangePassword(true);
            setMnemonicForm(false);
            setErrorMessage("");
            setShow(false);
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
                                            onKeyPress={ValidateStringSpaces}
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
                                <div className="buttons">
                                    <p className="button-link" onClick={() => handleRoute('changePassword')}>
                                        {t('CHANGE_KEYSTORE_PASSWORD')}
                                    </p>
                                </div>
                            </div>
                        </>
                        : null
                }

            </Modal>

            {generateKey ?
                <GeneratePrivateKey mnemonic={userMnemonic} handleRoute={handleRoute} setGenerateKey={setGenerateKey}
                    routeValue="hideGenerateKeyStore" formName="Generate KeyStore File"
                    handleClose={handleClose}/>
                : null
            }
            {changePassword ?
                <ChangePassword mnemonic={userMnemonic} handleRoute={handleRoute} setChangePassword={setChangePassword}
                    routeValue="hideGenerateKeyStore" formName="Generate KeyStore File"
                    handleClose={handleClose}/>
                : null
            }
        </>

    );
};
export default GenerateKeyStore;
