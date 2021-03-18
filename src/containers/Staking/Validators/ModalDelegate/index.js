import { connect } from 'react-redux';
import {Form, Modal as ReactModal} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';
import { hideTxDelegateModal } from '../../../../actions/transactions/delegate';
import success from "../../../../assets/images/success.svg";
const ModalDelegate = (props) => {
    const [amount, setAmount] = useState(0);
    const [response, setResponse] = useState(false);
    const handleAmount = (amount) =>{
        setAmount(amount)
    }

    const handleAmountChange = (evt) =>{
        setAmount(evt.target.value)
    }

    return (
        <ReactModal
            animation={false}
            backdrop="static"
            centered={true}
            keyboard={false}
            show={props.show}
            className="modal-custom delegate-modal"
            onHide={props.onHide}>
            {!response ?
                <>
                    <ReactModal.Header>
                        Delegating to Cosmostation
                    </ReactModal.Header>
                    <ReactModal.Body className="delegate-modal-body">
                        <Form>
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

const stateToProps = (state) => {
    return {
        show: state.modal,
    };
};

const actionsToProps = {
    onHide: hideTxDelegateModal,
};

export default connect(stateToProps, actionsToProps)(ModalDelegate);
