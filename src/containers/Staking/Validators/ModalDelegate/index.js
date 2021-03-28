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
import React, {useContext, useState} from 'react';
import success from "../../../../assets/images/success.svg";
import Icon from "../../../../components/Icon";
import MakePersistence from "../../../../utils/cosmosjsWrapper";
import aminoMsgHelper from "../../../../utils/aminoMsgHelper";
import MessagesFile from "../../../../utils/protoMsgHelper";
import KeplerTransaction from "../../../../utils/KeplerTransactions";

const ModalDelegate = (props) => {
    const PropertyMsgHelper = new MessagesFile();
    const [amount, setAmount] = useState(0);
    const [show, setShow] = useState(true);
    const [memoContent, setMemoContent] = useState('');
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [response, setResponse] = useState('');
    const [advanceMode, setAdvanceMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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
        props.setTxModalShow(false);
        props.setInitialModal(true);
        setResponse('');
    };
    const handlePrevious = () => {
        props.setShow(true);
        props.setTxModalShow(false);
        props.setInitialModal(true);
    };
    const handleSubmitInitialData = async event => {
        event.preventDefault();
        const memo = event.target.memo.value;
        setMemoContent(memo);
        setInitialModal(false);
        showSeedModal(true);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const mnemonic = event.target.mnemonic.value;
        const validatorAddress = props.validatorAddress;
        const address = localStorage.getItem('address');
        const mode = localStorage.getItem('loginMode');
        if (mode === "kepler") {
            const response = KeplerTransaction([PropertyMsgHelper.msgDelegate(address, validatorAddress, amount)], aminoMsgHelper.fee(5000, 250000), memoContent);
            response.then(result => {
                console.log(result)
            }).catch(err => console.log(err.message, "delegate error"))
        } else {
            let accountNumber = 0;
            let addressIndex = 0;
            let bip39Passphrase = "";
            if (advanceMode) {
                accountNumber = document.getElementById('delegateAccountNumber').value;
                addressIndex = document.getElementById('delegateAccountIndex').value;
                bip39Passphrase = document.getElementById('delegatebip39Passphrase').value;
            }
            const persistence = MakePersistence(accountNumber, addressIndex);
            const address = persistence.getAddress(mnemonic, bip39Passphrase, true);
            const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);
            console.log(address.error, "rdsult");
            if (address.error === undefined && ecpairPriv.error === undefined) {
                persistence.getAccounts(address).then(data => {
                    if (data.code === undefined) {
                        let stdSignMsg = persistence.newStdMsg({
                            msgs: aminoMsgHelper.msgs(aminoMsgHelper.delegateMsg(amount, address, validatorAddress)),
                            fee: aminoMsgHelper.fee(5000, 250000),
                            chain_id: persistence.chainId,
                            memo: memoContent,
                            account_number: String(data.account.account_number),
                            sequence: String(data.account.sequence)
                        });
                        const signedTx = persistence.sign(stdSignMsg, ecpairPriv);
                        persistence.broadcast(signedTx).then(response => {
                            setResponse(response)
                            console.log(response, "delegate response")
                        });
                        showSeedModal(false);
                    } else {
                        setErrorMessage(data.message);
                    }
                });
            } else {
                if (address.error !== undefined) {
                    setErrorMessage(address.error)
                } else {
                    setErrorMessage(ecpairPriv.error)
                }
            }
        }
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
        <>
            {initialModal ?
                <>
                    <Modal.Header closeButton>
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
                                        min={0}
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
                                              required={false}/>
                            </div>
                            <div className="buttons navigate-buttons">
                                <button className="button button-secondary" onClick={() => handlePrevious()}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                                <button className="button button-primary">Next</button>
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {seedModal ?
                <>
                    <Modal.Header closeButton>
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
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">Account Index</p>
                                                <Form.Control
                                                    type="text"
                                                    name="privateAccountIndex"
                                                    id="delegateAccountIndex"
                                                    placeholder="Account Index"
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">bip39Passphrase</p>
                                                <Form.Control
                                                    type="password"
                                                    name="delegatebip39Passphrase"
                                                    id="delegatebip39Passphrase"
                                                    placeholder="Enter bip39Passphrase (optional)"
                                                    required={false}
                                                />
                                            </div>
                                        </>
                                    </Accordion.Collapse>
                                    {
                                        errorMessage !== "" ?
                                            <p className="form-error">{errorMessage}</p>
                                            : null
                                    }
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
                        <Modal.Header className="result-header success" closeButton>
                            Successfully Delegated!
                        </Modal.Header>
                        <Modal.Body className="delegate-modal-body">
                            <div className="result-container">
                                <img src={success} alt="success-image"/>
                                <p className="tx-hash">Tx Hash: {response.txhash}</p>
                                <div className="buttons">
                                    <button className="button" onClick={props.handleClose}>Done</button>
                                </div>
                            </div>
                        </Modal.Body>
                    </>
                    : null
            }{
            response !== '' && response.code !== undefined ?
                <>
                    <Modal.Header className="result-header error" closeButton>
                        Failed to Delegate
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <div className="result-container">
                            <p className="tx-hash">Tx Hash:
                                {response.txhash}</p>
                            <p>{response.raw_log}</p>
                            <div className="buttons">
                                <button className="button" onClick={props.handleClose}>Done</button>
                            </div>
                        </div>
                    </Modal.Body>
                </>
                : null
        }
        </>
    );
};


export default ModalDelegate;
