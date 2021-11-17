import { Modal as ReactModal } from 'react-bootstrap';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hideKeyStoreModal} from "../../../actions/transactions/keyStore";
import {showFeeModal} from "../../../actions/transactions/fee";
import FileInput from "./FileInput";
import Password from "./Password";
import Submit from "./Submit";
import Icon from "../../../components/Icon";

const Modal = () => {
    const show = useSelector((state) => state.keyStore.modal);
    console.log(show, "show in fee");
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideKeyStoreModal());
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
                <FileInput/>
                <Password/>
                <Submit/>
            </ReactModal.Body>
        </ReactModal>
    );
};



export default Modal;
