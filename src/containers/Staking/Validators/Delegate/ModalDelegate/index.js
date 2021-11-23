import { Modal as ReactModal } from 'react-bootstrap';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";

const Modal = () => {
    const show = useSelector((state) => state.keyStore.modal);
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
            className="modal-custom delegate-modal"
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



export default ModalDelegate;
