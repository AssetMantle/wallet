import {Modal as ReactModal} from 'react-bootstrap';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
// import Icon from "../../../components/Icon";
// import helper from "../../../utils/helper";
import {hideResultModal} from "../../../store/actions/generateKeyStore";
import Icon from "../../../components/Icon";

const ModalResult = () => {
    const {t} = useTranslation();

    const show = useSelector((state) => state.generateKeyStore.resultModal);
    console.log(show, "new modal");
    // const password = useSelector((state) => state.generateKeyStore.newPassword);
    // const response = useSelector((state) => state.generateKeyStore.response);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideResultModal());
    };

    // const handleResetSubmit = async () => {
    //     const mnemonic = response.value.mnemonic;
    //     let encryptedData = helper.createStore(mnemonic, password.value);
    //     let jsonContent = JSON.stringify(encryptedData.Response);
    //     await downloadFile(jsonContent);
    // };
    //
    // const downloadFile = async (jsonContent) => {
    //     const json = jsonContent;
    //     const fileName = "KeyStore";
    //     const blob = new Blob([json], {type: 'application/json'});
    //     const href = await URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = href;
    //     link.download = fileName + ".json";
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };



    return (
        <ReactModal
            animation={false}
            backdrop="static"
            className="create-wallet-modal seed"
            centered={true}
            keyboard={false}
            show={show}
            onHide={handleClose}>
            <ReactModal.Header closeButton={true}>
                <p>{t("KEYSTORE_PASSWORD_RESET")}</p>
            </ReactModal.Header>
            <ReactModal.Body className="create-wallet-body create-wallet-form-body">
                <div className="downloaded-keystore-box">
                    <p>Keystore Successfully downloaded</p>
                </div>
                <div className="note-section">
                    <div className="exclamation"><Icon
                        viewClass="arrow-right"
                        icon="exclamation"/></div>
                    <p>{t("PRIVATE_KEY_PASSWORD_NOTE")}</p>
                </div>
            </ReactModal.Body>
        </ReactModal>
    );
};



export default ModalResult;
