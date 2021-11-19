import * as PropTypes from 'prop-types';
import { Modal as ReactModal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { hideTxSendModal } from '../../../../actions/transactions/send';
import Amount from './Amount';
import Label from '../../../../components/Label';
import Memo from './Memo';
import React from 'react';
import Send from './ButtonSend';
import TextBox from '../../../../components/TextBox';
import ToAddress from "./ToAddress";

const Modal = ({
    show,
    onHide,
}) => {
    return (
        <ReactModal
            animation={false}
            backdrop="static"
            centered={true}
            keyboard={false}
            show={show}
            onHide={onHide}>
            <ReactModal.Header closeButton={true}>
                <TextBox
                    className="modal-title"
                    value="Sending Amount"
                />
            </ReactModal.Header>
            <ReactModal.Body>
                <div className="flex-item">
                    <Label
                        className=""
                        label="To Address"
                    />
                    <ToAddress/>
                </div>
                <div className="flex-item">
                    <Label
                        className=""
                        label="Amount"
                    />
                    <Amount/>
                </div>
                <div className="form-group">
                    <Label
                        className=""
                        label="Memo"
                    />
                    <Memo/>
                </div>
                <Send/>
            </ReactModal.Body>
        </ReactModal>
    );
};

Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
    return {
        show: state.transactions.send.modal,
    };
};

const actionsToProps = {
    onHide: hideTxSendModal,
};

export default connect(stateToProps, actionsToProps)(Modal);
