import { Modal as ReactModal } from 'react-bootstrap';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hideFeeModal} from "../../../actions/transactions/fee";
import Fee from "./index";
import Gas from "./Gas";
import Submit from "./Submit";

const Modal = () => {
    const show = useSelector((state) => state.fee.modal);
    console.log(show, "show in fee");
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(hideFeeModal());
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
                <p>Send Token</p>
            </ReactModal.Header>
            <ReactModal.Body className="create-wallet-body import-wallet-body">
                <Fee/>
                <Gas/>
                <Submit/>
            </ReactModal.Body>
        </ReactModal>
    );
};



export default Modal;
