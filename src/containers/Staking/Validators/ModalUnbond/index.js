import React from 'react';
import {Modal as ReactModal} from "react-bootstrap";
import Icon from "../../../../components/Icon";
import Amount from "./Amount";
import Memo from "./Memo";
import ButtonSubmit from "./ButtonSubmit";
import {useDispatch, useSelector} from "react-redux";
import {hideTxUnbondModal} from "../../../../store/actions/transactions/unbond";
import {showValidatorTxModal} from "../../../../store/actions/validators";

const ModalUnbond = () => {
    const dispatch = useDispatch();
    const show = useSelector((state) => state.unbondTx.modal);

    const handleClose = () =>{
        dispatch(hideTxUnbondModal());
    };

    const handlePrevious = () =>{
        dispatch(showValidatorTxModal());
        dispatch(hideTxUnbondModal());
    };

    return (

        <ReactModal
            animation={false}
            backdrop="static"
            className="modal-custom delegate-modal modal-unbond"
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
                <Amount/>
                <Memo/>
                <ButtonSubmit/>
            </ReactModal.Body>
        </ReactModal>
    );
};



export default ModalUnbond;
