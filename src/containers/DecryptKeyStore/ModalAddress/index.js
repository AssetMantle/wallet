import {Modal as ReactModal} from 'react-bootstrap';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hideKeyStoreResultModal, showKeyStoreModal} from "../../../store/actions/signIn/keyStore";
import Icon from "../../../components/Icon";
import {useTranslation} from "react-i18next";

const ModalAddress = () => {
    const {t} = useTranslation();
    const show = useSelector((state) => state.signInKeyStore.keyStoreResultModal);
    const response = useSelector((state) => state.signInKeyStore.response.value);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideKeyStoreResultModal());
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
                    <b>{t("MNEMONIC")}: </b>{response && response[0]}</p>
                <p className="mnemonic-result">
                    <b>{t("WALLET_PATH")}: </b>{response && response[1].walletPath}</p>
                <p className="mnemonic-result"><b>{t("ADDRESS")}: </b>{response && response[1].address}
                </p>
            </ReactModal.Body>
        </ReactModal>
    );
};


export default ModalAddress;
