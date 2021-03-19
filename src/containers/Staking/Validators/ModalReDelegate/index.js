import {Form, Modal, OverlayTrigger, Popover} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';
import success from "../../../../assets/images/success.svg";
import Icon from "../../../../components/Icon";
const ModalReDelegate = (props) => {
    const [amount, setAmount] = useState(0);
    const [show, setShow] = useState(true);

    const handleAmount = (amount) => {
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
        event.preventDefault()
        const amount = event.target.amount.value;
    };
    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                Delegate your XPRT to Cosmostation to earn staking rewards. You can claim your staking rewards from the rewards section on the staking interface.
                <p><b>Note:</b> Unstaking/Unbonding on Persistence takes 21 days.</p>
            </Popover.Content>
        </Popover>
    );
    return (
        <Modal
            animation={false}
            centered={true}
            show={show}
            className="modal-custom delegate-modal"
            onHide={handleClose}>
            <Modal.Header>
                Redelegating to Cosmostation
                <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
                    <button className="icon-button info"><Icon
                        viewClass="arrow-right"
                        icon="info"/></button>
                </OverlayTrigger>
            </Modal.Header>
            <Modal.Body className="delegate-modal-body">
                <Form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <p className="label">Your password</p>
                        <Form.Control
                            type="text"
                            name="amount"
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
                    <div className="buttons">
                        <button className="button button-primary">Delegate</button>
                    </div>
                </Form>
            </Modal.Body>

        </Modal>
    );
};


export default ModalReDelegate;
