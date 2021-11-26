import React from 'react';
import {Modal as ReactModal} from "react-bootstrap";
import Icon from "../../../../components/Icon";
import Amount from "./Amount";
import Memo from "./Memo";
import ButtonSubmit from "./ButtonSubmit";
import {useDispatch, useSelector} from "react-redux";
import {hideTxReDelegateModal} from "../../../../store/actions/transactions/redelegate";
import {showValidatorTxModal} from "../../../../store/actions/validators";
import Validator from "./Validator";
const ModalReDelegate = () => {
    const dispatch = useDispatch();
    const show = useSelector((state) => state.redelegate.modal);

    const handleClose = () =>{
        dispatch(hideTxReDelegateModal());
    };

    const handlePrevious = () =>{
        dispatch(showValidatorTxModal());
        dispatch(hideTxReDelegateModal());
    };

    return (

        <ReactModal
            animation={false}
            backdrop="static"
            className="modal-custom delegate-modal modal-redelegate"
            centered={true}
            keyboard={false}
            show={show}
            onHide={handleClose}>
            <ReactModal.Header closeButton>
                <div className="previous-section txn-header">
                    <button className="button" onClick={() => handlePrevious()}>
                        <Icon
                            viewClass="arrow-right"
                            icon="left-arrow"/>
                    </button>
                </div>
                <h3 className="heading">Redelegate
                </h3>
            </ReactModal.Header>
            <ReactModal.Body className="delegate-modal-body">
                <Validator/>
                <Amount/>
                <Memo/>
                <ButtonSubmit/>
            </ReactModal.Body>
        </ReactModal>
    );
};



export default ModalReDelegate;
