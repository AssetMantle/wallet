import { Modal as ReactModal } from 'react-bootstrap';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hideKeyStoreModal} from "../../../store/actions/transactions/keyStore";
import {showFeeModal} from "../../../store/actions/transactions/fee";
import FileInput from "./FileInput";
import Password from "./Password";
import Submit from "./Submit";
import Icon from "../../../components/Icon";
import Advanced from "../Advanced";
import {setLoginInfo} from "../../../store/actions/transactions/common";
import {useTranslation} from "react-i18next";
const Modal = () => {
    const {t} = useTranslation();
    const show = useSelector((state) => state.keyStore.modal);
    const encryptedSeed = useSelector((state) => state.common.loginInfo.encryptedSeed);
    const dispatch = useDispatch();
    const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
    useEffect(()=>{
        console.log(encryptedSeed, encryptedMnemonic, "encryptedMnemonic1" );
        if (encryptedMnemonic !== null) {
            dispatch(setLoginInfo({
                encryptedSeed:true,
                error:{
                    message:''
                }}));
        } else {
            dispatch(setLoginInfo({
                encryptedSeed:false,
                error:{
                    message:''
                }}));
        }
    },[]);

    const handleClose = () => {
        dispatch(hideKeyStoreModal());
    };

    const handleUpdateKeystore = () => {
        dispatch(setLoginInfo({
            encryptedSeed:false,
            error:{
                message:''
            }}));
    };


    const keyStorePrevious = () => {
        dispatch(hideKeyStoreModal());
        dispatch(showFeeModal());
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
            <ReactModal.Header closeButton={true}>
                <div className="previous-section txn-header">
                    <button className="button" onClick={() => keyStorePrevious()}>
                        <Icon
                            viewClass="arrow-right"
                            icon="left-arrow"/>
                    </button>
                </div>
                <p>KeyStore</p>
            </ReactModal.Header>
            <ReactModal.Body className="create-wallet-body import-wallet-body">
                {!encryptedSeed ?
                    <FileInput/>
                    : null
                }
                <Password/>
                <Advanced/>
                <Submit/>
                {
                    encryptedSeed ?
                        <div className="buttons">
                            <p className="button-link"
                                onClick={handleUpdateKeystore}>
                                {t("CHANGE_KEY_STORE")}
                            </p>
                        </div>
                        : null
                }
            </ReactModal.Body>
        </ReactModal>
    );
};



export default Modal;
