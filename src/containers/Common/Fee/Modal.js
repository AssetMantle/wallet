import { Modal as ReactModal } from 'react-bootstrap';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hideFeeModal} from "../../../store/actions/transactions/fee";
import Fee from "./index";
import Gas from "./Gas";
import Submit from "./Submit";
import Loader from "../../../components/Loader";

const Modal = () => {
    const show = useSelector((state) => state.fee.modal);
    const inProgress = useSelector((state) => state.common.inProgress);

    console.log(inProgress, "inProgress");
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(hideFeeModal());
    };
    if (inProgress) {
        return <Loader/>;
    }
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
                <p>Fee</p>
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
