import {Form, Modal, OverlayTrigger, Popover} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';
import success from "../../../../assets/images/success.svg";
import Icon from "../../../../components/Icon";
import Persistence from "../../../../utils/cosmosjsWrapper";
const ModalWithdraw = (props) => {
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState('');

    const handleClose = () => {
        setShow(false)
        props.setModalOpen('');
        setResponse('');
    };
    const handleSubmit = async event => {
        event.preventDefault();
        const password = event.target.password.value;
        const mnemonic = event.target.mnemonic.value;
        const validatorAddress = 'persistencevaloper15qsq6t6zxg60r3ljnxdpn9c6qpym2uvjl37hpl';
        const persistence = Persistence;
        const address = persistence.getAddress(mnemonic);
        const ecpairPriv = persistence.getECPairPriv(mnemonic);


        persistence.getAccounts(address).then(data => {
            let stdSignMsg = persistence.newStdMsg({
                msgs: [
                    {
                        type: "cosmos-sdk/MsgWithdrawDelegationReward",
                        value: {
                            delegator_address: address,
                            validator_address: validatorAddress
                        }
                    }
                ],
                chain_id: persistence.chainId,
                fee: { amount: [ { amount: String(5000), denom: "uxprt" } ], gas: String(200000) },
                memo: "",
                account_number: String(data.account.account_number),
                sequence: String(data.account.sequence)
            });

            const signedTx = persistence.sign(stdSignMsg, ecpairPriv);
            persistence.broadcast(signedTx).then(response => {
                setResponse(response)
                console.log(response.code)});
        })

        console.log(password, mnemonic, validatorAddress, "delegate form value") //amount taking stake.
    };

    return (
        <Modal
            animation={false}
            centered={true}
            show={show}
            className="modal-custom delegate-modal"
            onHide={handleClose}>
            {
                response === '' ?
                    <> <Modal.Header>
                        Claim Staking Rewards
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
                                    <Form.Control as="textarea" rows={3} name="mnemonic"
                                                  placeholder="Enter Seed"
                                                  required={true}/>
                                </div>
                                <div className="buttons">
                                    <button className="button button-primary">Claim Rewards</button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </>
                    : <>
                        {
                            response.code === undefined ?
                                <>
                                    <Modal.Header className="result-header success">
                                        Successfully Claimed!
                                    </Modal.Header>
                                    <Modal.Body className="delegate-modal-body">
                                        <div className="result-container">
                                            <img src={success} alt="success-image"/>
                                            <p className="tx-hash">Tx Hash: {response.txhash}</p>
                                            <div className="buttons">
                                                <button className="button">Done</button>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                </>
                                :  <>
                                    <Modal.Header className="result-header error">
                                        Failed to Claim
                                    </Modal.Header>
                                    <Modal.Body className="delegate-modal-body">
                                        <div className="result-container">
                                            <p className="tx-hash">Tx Hash:
                                                {response.txhash}</p>
                                            <p>{response.raw_log}</p>
                                            <div className="buttons">
                                                <button className="button" onClick={handleClose}>Done</button>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                </>
                        }
                    </>
            }

        </Modal>
    );
};


export default ModalWithdraw;
