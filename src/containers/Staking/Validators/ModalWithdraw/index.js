import {
    Accordion,
    AccordionContext,
    Card,
    Form,
    Modal,
    OverlayTrigger,
    Popover,
    useAccordionToggle
} from 'react-bootstrap';
import React, {useState, useEffect, useContext} from 'react';
import success from "../../../../assets/images/success.svg";
import Icon from "../../../../components/Icon";
import MakePersistence from "../../../../utils/cosmosjsWrapper";
const ModalWithdraw = (props) => {
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState('');
    const [advanceMode, setAdvanceMode] = useState(false);
    const [privateAdvanceMode, setPrivateAdvanceMode] = useState(false);
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [memoContent, setMemoContent] = useState('');
    const handleClose = () => {
        setShow(false)
        props.setModalOpen('');
        setResponse('');
    };

    function ContextAwareToggle({children, eventKey, callback}) {
        const currentEventKey = useContext(AccordionContext);

        const decoratedOnClick = useAccordionToggle(
            eventKey,
            () => callback && callback(eventKey),
        );
        const handleAccordion = (event) => {
            decoratedOnClick(event);
            setPrivateAdvanceMode(!privateAdvanceMode);
            setAdvanceMode(!advanceMode);
        };
        const isCurrentEventKey = currentEventKey === eventKey;

        return (
            <button
                type="button"
                className="accordion-button"
                onClick={handleAccordion}
            >
                {isCurrentEventKey ?
                    <Icon
                        viewClass="arrow-right"
                        icon="up-arrow"/>
                    :
                    <Icon
                        viewClass="arrow-right"
                        icon="down-arrow"/>}

            </button>
        );
    }

    const handleSubmitInitialData = async event => {
        event.preventDefault();
        const memo = event.target.memo.value;
        setMemoContent(memo);
        setInitialModal(false);
        showSeedModal(true);
    };
    const handleSubmit = async event => {
        event.preventDefault();
        showSeedModal(false);
        // const password = event.target.password.value;
        const mnemonic = event.target.mnemonic.value;
        const validatorAddress = 'persistencevaloper15qsq6t6zxg60r3ljnxdpn9c6qpym2uvjl37hpl';

        let accountNumber = 0
        let addressIndex = 0
        let bip39Passphrase = ""
        if (advanceMode) {
            accountNumber = document.getElementById('claimAccountNumber').value;
            addressIndex = document.getElementById('claimAccountIndex').value;
            bip39Passphrase = document.getElementById('claimbip39Passphrase').value;
        }
        const persistence = MakePersistence(accountNumber,addressIndex);
        const address = persistence.getAddress(mnemonic, bip39Passphrase,true);
        const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);


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
                fee: {amount: [{amount: String(5000), denom: "uxprt"}], gas: String(200000)},
                memo: memoContent,
                account_number: String(data.account.account_number),
                sequence: String(data.account.sequence)
            });

            const signedTx = persistence.sign(stdSignMsg, ecpairPriv);
            persistence.broadcast(signedTx).then(response => {
                setResponse(response);
                console.log(response.code)
            });
        });

        console.log(mnemonic, validatorAddress, "delegate form value") //amount taking stake.
    };

    return (
        <Modal
            animation={false}
            centered={true}
            show={show}
            className="modal-custom delegate-modal"
            onHide={handleClose}>
            {initialModal ?
                <>
                    <Modal.Header>
                        Claim Staking Rewards
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={handleSubmitInitialData}>
                            {/*<div className="form-field">*/}
                            {/*    <p className="label">Your password</p>*/}
                            {/*    <Form.Control*/}
                            {/*        type="password"*/}
                            {/*        name="password"*/}
                            {/*        placeholder="Enter Your Wallet Password"*/}
                            {/*        required={true}*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div className="form-field">
                                <p className="label">Memo</p>
                                <Form.Control as="textarea" rows={3} name="memo"
                                              placeholder="Enter Memo"
                                              required={true}/>
                            </div>
                            <div className="buttons">
                                <button className="button button-primary">Next</button>
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {seedModal ?
                <>
                    <Modal.Header>
                        Claim Staking Rewards
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={handleSubmit}>
                            <div className="form-field">
                                <p className="label">Mnemonic</p>
                                <Form.Control as="textarea" rows={3} name="mnemonic"
                                              placeholder="Enter Mnemonic"
                                              required={true}/>
                            </div>
                            <Accordion className="advanced-wallet-accordion">
                                <Card>
                                    <Card.Header>
                                        <p>
                                            Advanced
                                        </p>
                                        <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <>
                                            <div className="form-field">
                                                <p className="label">Account</p>
                                                <Form.Control
                                                    type="text"
                                                    name="privateAccountNumber"
                                                    id="claimAccountNumber"
                                                    placeholder="Account number"
                                                    required={privateAdvanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">Account Index</p>
                                                <Form.Control
                                                    type="text"
                                                    name="privateAccountIndex"
                                                    id="claimAccountIndex"
                                                    placeholder="Account Index"
                                                    required={privateAdvanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">bip39Passphrase</p>
                                                <Form.Control
                                                    type="password"
                                                    name="bip39Passphrase"
                                                    id="claimbip39Passphrase"
                                                    placeholder="Enter bip39Passphrase (optional)"
                                                    required={true}
                                                />
                                            </div>
                                        </>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                            <div className="buttons">
                                <button className="button button-primary">Claim Rewards</button>
                            </div>
                        </Form>
                    </Modal.Body>

                </>
                : null
            }
            {
                response !== '' && response.code === undefined ?
                    <>
                        <Modal.Header className="result-header success">
                            Successfully Delegated!
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
                    : null
            }
            {
                response !== '' && response.code !== undefined ?
                    <>
                        <Modal.Header className="result-header error">
                            Failed to Delegate
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
                    : null
            }
        </Modal>
    );
};


export default ModalWithdraw;
