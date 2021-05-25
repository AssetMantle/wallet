import {
    Form,
    Modal,
} from 'react-bootstrap';
import React, {useState} from 'react';

import {connect} from "react-redux";
import {useTranslation} from "react-i18next";

const ModalCustomChannel = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);

    const handleSubmit = async event => {
        event.preventDefault();

    };
    const handleClose = () => {
        setShow(false);
        props.handleClose();
        props.setWithDraw(false);
    };

    return (
        <Modal
            animation={false}
            centered={true}
            keyboard={false}
            backdrop="static"
            show={show}
            className="modal-custom claim-rewards-modal"
            onHide={handleClose}>
            <>
                <Modal.Header className="result-header success" closeButton>
                    {t("ADDING_CHANNEL")}
                </Modal.Header>
                <Modal.Body className="delegate-modal-body">
                    <Form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <p className="label info">Port</p>
                            <Form.Control
                                type="text"
                                name="port"
                                placeholder="Enter port"
                                required={true}
                            />
                        </div>
                        <div className="form-field">
                            <p className="label info">Channel</p>
                            <Form.Control
                                type="text"
                                name="channel"
                                placeholder="Enter Channel"
                                required={true}
                            />
                        </div>
                        <button className="button button-primary"
                        >Submit</button>
                    </Form>
                </Modal.Body>
            </>
        </Modal>
    );
};

const stateToProps = (state) => {
    return {
        list: state.rewards.list,
        tokenPrice: state.tokenPrice.tokenPrice,
        status: state.delegations.status,
        delegations: state.delegations.count,
        withdrawAddress: state.withdrawAddress.withdrawAddress,
        transferableAmount: state.balance.transferableAmount,
    };
};

export default connect(stateToProps)(ModalCustomChannel);
