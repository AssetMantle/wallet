import {Form, Modal, OverlayTrigger, Popover} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';
import success from "../../../../assets/images/success.svg";
import Icon from "../../../../components/Icon";
const ModalUnbond = (props) => {
    const [amount, setAmount] = useState(0);
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState(false);

    const handleAmount = (amount) =>{
        setAmount(amount)
    };

    const handleAmountChange = (evt) =>{
        setAmount(evt.target.value)
    };
    const handleClose = () =>{
        setShow(false)
        props.setModalOpen('');
    };
    const handleSubmit = async event => {
        event.preventDefault();
        const password = event.target.password.value;
        const mnemonic = event.target.mnemonic.value;
        const validatorAddress = 'persistencevaloper15qsq6t6zxg60r3ljnxdpn9c6qpym2uvjl37hpl';
        console.log(amount,password, mnemonic, validatorAddress, "delegate form value") //amount taking stake.
    };

    return (
        <Modal
            animation={false}
            centered={true}
            show={show}
            className="modal-custom delegate-modal"
            onHide={handleClose}>
            <Modal.Header>
                Unbonding to Cosmostation
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
                        <p className="label">Send Amount</p>
                        <div className="amount-field">
                            <Form.Control
                                type="text"
                                name="amount"
                                placeholder="Send Amount"
                                value={amount}
                                onChange={handleAmountChange}
                                required={true}
                            />
                            <div className="range-buttons">
                                <button type="button" className="button button-range"
                                        onClick={() => handleAmount(25000000)}>25%
                                </button>
                                <button type="button" className="button button-range"
                                        onClick={() => handleAmount(50000000)}>50%
                                </button>
                                <button type="button" className="button button-range"
                                        onClick={() => handleAmount(75000000)}>75%
                                </button>
                                <button type="button" className="button button-range"
                                        onClick={() => handleAmount(100000000)}>Max
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="form-field">
                        <p className="label">Memo</p>
                        <Form.Control as="textarea" rows={5} name="mnemonic"
                                      placeholder="Enter Seed"
                                      required={true}/>
                    </div>
                    <div className="buttons">
                        <button className="button button-primary">Unbond</button>
                    </div>
                </Form>
            </Modal.Body>

        </Modal>
    );
};


export default ModalUnbond;
