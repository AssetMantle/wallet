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

const ModalDelegate = (props) => {
    const [amount, setAmount] = useState(0);
    const [show, setShow] = useState(true);
    const [memoContent, setMemoContent] = useState('');
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [response, setResponse] = useState('');
    const [advanceMode, setAdvanceMode] = useState(false);
    const [privateAdvanceMode, setPrivateAdvanceMode] = useState(false);
    const handleAmount = (amount) => {
        setAmount(amount)
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

    const handleAmountChange = (evt) => {
        setAmount(evt.target.value)
    };
    const handleClose = () => {
        setShow(false);
        props.setModalOpen('');
        setResponse('');
    };

    const handleSubmitInitialData = async event => {
        event.preventDefault();
        const memo = event.target.memo.value;
        setMemoContent(memo);
        setInitialModal(false)
        showSeedModal(true);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const mnemonic = event.target.mnemonic.value;
        const validatorAddress = 'persistencevaloper15qsq6t6zxg60r3ljnxdpn9c6qpym2uvjl37hpl';
        let accountNumber = 0;
        let addressIndex = 0;
        let bip39Passphrase = "";
        if (advanceMode) {
            accountNumber = document.getElementById('delegateAccountNumber').value;
            addressIndex = document.getElementById('delegateAccountIndex').value;
            bip39Passphrase = document.getElementById('delegatebip39Passphrase').value;
        }
        const persistence = MakePersistence(accountNumber,addressIndex);
        const address = persistence.getAddress(mnemonic, bip39Passphrase,true);
        const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);

        persistence.getAccounts(address).then(data => {
            let stdSignMsg = persistence.newStdMsg({
                msgs: [
                    {
                        type: "cosmos-sdk/MsgDelegate",
                        value: {
                            amount: {
                                amount: String(1000000),
                                denom: "uxprt"
                            },
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
                setResponse(response)
                console.log(response.code)});
        });
        console.log(amount, mnemonic, validatorAddress, "delegate form value") //amount taking stake.
    };
    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                Delegate your XPRT to {props.moniker} to earn staking rewards.
                <p><b>Note:</b> Unstaking or Unbonding period: 21 days.</p>
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
            {initialModal ?
                <>
                    <Modal.Header>
                        Delegating to {props.moniker}
                        <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
                            <button className="icon-button info"><Icon
                                viewClass="arrow-right"
                                icon="info"/></button>
                        </OverlayTrigger>
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={handleSubmitInitialData}>

                            <div className="form-field">
                                <p className="label">Send Amount</p>
                                <div className="amount-field">
                                    <Form.Control
                                        type="number"
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
                        Delegating to {props.moniker}
                        <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
                            <button className="icon-button info"><Icon
                                viewClass="arrow-right"
                                icon="info"/></button>
                        </OverlayTrigger>
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
                                                    id="delegateAccountNumber"
                                                    placeholder="Account number"
                                                    required={privateAdvanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">Account Index</p>
                                                <Form.Control
                                                    type="text"
                                                    name="privateAccountIndex"
                                                    id="delegateAccountIndex"
                                                    placeholder="Account Index"
                                                    required={privateAdvanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">bip39Passphrase</p>
                                                <Form.Control
                                                    type="password"
                                                    name="delegatebip39Passphrase"
                                                    placeholder="Enter bip39Passphrase (optional)"
                                                    required={true}
                                                />
                                            </div>
                                        </>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                            <div className="buttons">
                                <button className="button button-primary">Delegate</button>
                            </div>
                        </Form>
                    </Modal.Body>

                </>

                :
                null

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
            }{
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


export default ModalDelegate;
