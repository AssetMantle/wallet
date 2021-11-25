import { Modal as ReactModal } from 'react-bootstrap';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hideFeeModal} from "../../../store/actions/transactions/fee";
import Fee from "./index";
import Gas from "./Gas";
import Submit from "./Submit";
import Icon from "../../../components/Icon";
import Loader from "../../../components/Loader";
// import {showTxWithDrawTotalModal} from "../../../store/actions/transactions/withdrawTotalRewards";

const Modal = () => {
    const show = useSelector((state) => state.fee.modal);
    const txInfo = useSelector((state) => state.common.txInfo);
    const inProgress = useSelector((state) => state.common.inProgress);
    console.log(txInfo.value.name, " fee modalshow");

    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(hideFeeModal());
    };

    if (inProgress) {
        return <Loader/>;
    }

    const handleBack = () => {
        dispatch(txInfo.value.modal);
        dispatch(hideFeeModal());
    };

    return (
        <ReactModal
            animation={false}
            backdrop="static"
            className="modal-custom fee-m"
            centered={true}
            keyboard={false}
            show={show}
            onHide={handleClose}>
            <ReactModal.Header closeButton={true}>
                {txInfo.value.name !== 'send' && txInfo.value.name !== 'ibc' ?
                    <div className="previous-section txn-header">
                        <button className="button" onClick={handleBack}>
                            <Icon
                                viewClass="arrow-right"
                                icon="left-arrow"/>
                        </button>
                    </div> : null
                }
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
