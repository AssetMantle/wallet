import { connect } from 'react-redux';
import {Form, Modal as ReactModal} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';
import success from "../../../assets/images/success.svg";
import icon from "../../../assets/images/icon.svg";
const ModalWithdraw = (props) => {
    const [show, setShow] = useState(true);
    const [amount, setAmount] = useState(0);
    const [response, setResponse] = useState(false);
    const handleAmount = (amount) =>{
        setAmount(amount)
    }
    const handleClose = (amount) =>{
        setShow(false)
    }

    const handleAmountChange = (evt) =>{
        setAmount(evt.target.value)
    };

    return (
        <ReactModal
            animation={false}
            backdrop="static"
            centered={true}
            keyboard={false}
            show={show}
            className="modal-custom claim-rewards-modal"
            onHide={handleClose}>
            {!response ?
                <>
                    <ReactModal.Header>
                        Claiming Rewards
                    </ReactModal.Header>
                    <ReactModal.Body className="rewards-modal-body">
                        <Form>
                            <div className="form-field">
                                <p className="label">Select Validator</p>
                                <Form.Control as="select" size="sm" custom>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Form.Control>
                            </div>
                            <div className="form-field">
                                <p className="label">Total Available</p>
                                <div className="available-tokens">
                                    <img src={icon} alt="icon"/>
                                    <p className="tokens">4.534 <span>XPRT</span></p>
                                    <p className="usd">=$194.04</p>
                                </div>
                            </div>
                            <div className="form-field">
                                <p className="label">Memo</p>
                                <Form.Control
                                    type="text"
                                    name="memo"
                                    placeholder="Insert memo (optional)"
                                    required={false}
                                />
                            </div>
                            <div className="buttons">
                                <button className="button button-primary">Withdraw</button>
                            </div>
                        </Form>
                    </ReactModal.Body>
                </>
                : null
            }
            {
                response ?
                    <>
                        <ReactModal.Header className="result-header success">
                            Succesfully Delegated!
                        </ReactModal.Header>
                        <ReactModal.Body className="delegate-modal-body">
                            <div className="result-container">
                                <img src={success} alt="success-image"/>
                                <p className="tx-hash">Tx Hash: CAC4BA3C67482F09B46E129A00A86846567941555685673599559EBB5899DB3C</p>
                                <div className="buttons">
                                    <button className="button" >Done</button>
                                </div>
                            </div>
                        </ReactModal.Body>
                    </>
                    : null
            }
        </ReactModal>
    );
};


export default ModalWithdraw;
