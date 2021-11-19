import { Modal as ReactModal } from 'react-bootstrap';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hideKeyStoreResultModal, showKeyStoreModal, keyStoreLogin} from "../../../../store/actions/signIn/keyStore";
import Icon from "../../../../components/Icon";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
const ModalAddress = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const show = useSelector((state) => state.signInKeyStore.keyStoreResultModal);
    const response = useSelector((state) => state.signInKeyStore.response.value);
    console.log(response, "response");
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideKeyStoreResultModal());
    };

    const handleLogin = () => {
        dispatch(keyStoreLogin(history));
    };

    const keyStorePrevious = () => {
        dispatch(hideKeyStoreResultModal());
        dispatch(showKeyStoreModal());
    };

    return (
        <ReactModal
            animation={false}
            backdrop="static"
            className="modal-custom"
            centered={true}
            keyboard={false}
            show={show}
            onHide={handleClose}>
            <ReactModal.Header closeButton>
                <div className="previous-section">
                    <button className="button" onClick={() => keyStorePrevious("advancedForm")}>
                        <Icon
                            viewClass="arrow-right"
                            icon="left-arrow"/>
                    </button>
                </div>
                <h3 className="heading">{t("LOGIN_WITH_KEYSTORE")}</h3>
            </ReactModal.Header>
            
            <ReactModal.Body className="create-wallet-body import-wallet-body">
                <p className="mnemonic-result">
                    <b>{t("WALLET_PATH")}: </b>{response.walletPath}</p>
                <p className="mnemonic-result"><b>{t("ADDRESS")}: </b>{response.address}
                </p>
                <div className="buttons">
                    <button className="button button-primary" onClick={handleLogin}>{t("LOGIN")}</button>
                </div>
            </ReactModal.Body>
        </ReactModal>
    );
};



export default ModalAddress;
