import {Modal as ReactModal, OverlayTrigger, Popover,} from 'react-bootstrap';
import React from 'react';
import Icon from "../../../../components/Icon";
import {useTranslation} from "react-i18next";
import Amount from "./Amount";
import {useDispatch, useSelector} from "react-redux";
import {hideTxDelegateModal} from "../../../../store/actions/transactions/delegate";
import ButtonSubmit from "./ButtonSubmit";
import {showValidatorTxModal} from "../../../../store/actions/validators";
import Memo from "../../../Common/Memo";
const ModalDelegate = (props) => {
    const dispatch = useDispatch();
    const show = useSelector((state) => state.delegate.modal);
    const {t} = useTranslation();

    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                {t("DELEGATE_HEADER_HINT")}
                <p><b>Note:</b> {t("DELEGATE_HEADER_HINT_NOTE")} </p>
            </Popover.Content>
        </Popover>
    );

    const handleClose = () =>{
        dispatch(hideTxDelegateModal());
    };

    const handlePrevious = () =>{
        dispatch(showValidatorTxModal());
        dispatch(hideTxDelegateModal());
    };

    return (

        <ReactModal
            animation={false}
            backdrop="static"
            className="modal-custom delegate-modal modal-delegate"
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
                <h3 className="heading">Delegate to {props.moniker}
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
                        <button className="icon-button info" type="button"><Icon
                            viewClass="arrow-right"
                            icon="info"/></button>
                    </OverlayTrigger>
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

export default ModalDelegate;
