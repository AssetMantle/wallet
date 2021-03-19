import {Form, Modal, OverlayTrigger, Popover} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';
import success from "../../../../assets/images/success.svg";
import Icon from "../../../../components/Icon";
const ModalWithdraw = (props) => {
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState(false);

    const handleClose = () => {
        setShow(false)
        props.setModalOpen('');
    };
    const handleSubmit = async event => {
        event.preventDefault();
        const password = event.target.password.value;
        const mnemonic = event.target.mnemonic.value;
        const validatorAddress = 'persistencevaloper15qsq6t6zxg60r3ljnxdpn9c6qpym2uvjl37hpl';
        console.log(password, mnemonic, validatorAddress, "delegate form value") //amount taking stake.
    };

    return (
        <Modal
            animation={false}
            centered={true}
            show={show}
            className="modal-custom delegate-modal"
            onHide={handleClose}>
            <Modal.Header>
                Claiming Rewards
            </Modal.Header>
            <Modal.Body className="delegate-modal-body">
                <Form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <p className="label">Your password</p>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter Your Wallet Password"
                            required={true}
                        />
                    </div>
                    <div className="form-field">
                        <p className="label">Memo</p>
                        <Form.Control as="textarea" rows={5} name="mnemonic"
                                      placeholder="Enter Seed"
                                      required={true}/>
                    </div>
                    <div className="buttons">
                        <button className="button button-primary">Withdraw</button>
                    </div>
                </Form>
            </Modal.Body>

        </Modal>
    );
};


export default ModalWithdraw;
