import React, {useContext, useState} from "react";
import {
    Accordion,
    AccordionContext,
    Card,
    Form,
    Modal,
    OverlayTrigger,
    Popover,
    useAccordionToggle
} from "react-bootstrap";
import Icon from "../../components/Icon";
import success from "../../assets/images/success.svg";
import MakePersistence from "../../utils/cosmosjsWrapper";
import KeplerTransaction from "../../utils/KeplerTransactions";
import helper from "../../utils/helper";

import protoMsgHelper from "../../utils/protoMsgHelper";

const {SigningStargateClient} = require("@cosmjs/stargate");

const Send = () => {
    const [amountField, setAmountField] = useState(0);
    const [toAddress, setToAddress] = useState('');
    const [txResponse, setTxResponse] = useState('');
    const [mnemonicForm, setMnemonicForm] = useState(false);
    const [show, setShow] = useState(true);
    const [advanceMode, setAdvanceMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    let mode = localStorage.getItem('loginMode');
    console.log(mode)
    let address = localStorage.getItem('address');
    const handleAmount = (amount) => {
        setAmountField(amount)
    };
    const handleClose = () => {
        setShow(false);
        setMnemonicForm(false);
        setTxResponse('');
        console.log(show, mnemonicForm)
    };
    const handleAmountChange = (evt) => {
        setAmountField(evt.target.value)
    };
    const handleSubmit = async event => {
        event.preventDefault();
        setToAddress(event.target.address.value);
        setMnemonicForm(true);
        setShow(true);
    };
    const handleSubmitKepler = async event => {
        event.preventDefault();
        const response = KeplerTransaction(helper.msgs(helper.sendMsg(amountField, address, event.target.address.value)), helper.fee(0, 250000), "");
        response.then(result => {
            console.log(result)
        }).catch(err => console.log(err.message, "send error"))
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

    const handleMnemonicSubmit = (evt) => {
        evt.preventDefault();
        const userMnemonic = evt.target.mnemonic.value;
        const mnemonic = "tank pair spray rely any menu airport shiver boost emerge holiday siege evil grace exile comfort fence mention pig bus cable scissors ability all";
        console.log(userMnemonic, "userMnemonic");
        let accountNumber = 0;
        let addressIndex = 0;
        let bip39Passphrase = "";
        if (advanceMode) {
            accountNumber = document.getElementById('sendAccountNumber').value;
            addressIndex = document.getElementById('sendAccountIndex').value;
            bip39Passphrase = document.getElementById('sendbip39Passphrase').value;
        }
        const persistence = MakePersistence(accountNumber, addressIndex);
        const address = persistence.getAddress(userMnemonic, bip39Passphrase, true);
        const ecpairPriv = persistence.getECPairPriv(userMnemonic, bip39Passphrase);
        if (address.error === undefined && ecpairPriv.error === undefined) {
            persistence.getAccounts(address).then(data => {
                if (data.code === undefined) {
                    let stdSignMsg = persistence.newStdMsg({
                        msgs: helper.msgs(helper.sendMsg(amountField, address, toAddress)),
                        chain_id: persistence.chainId,
                        fee: helper.fee(0, 250000),
                        memo: "",
                        account_number: String(data.account.account_number),
                        sequence: String(data.account.sequence)
                    });

                    const signedTx = persistence.sign(stdSignMsg, ecpairPriv);
                    persistence.broadcast(signedTx).then(response => {
                        setTxResponse(response)
                        console.log(response)
                    });
                } else {
                    setErrorMessage(data.message);
                }
            })
        } else {
            if (address.error !== undefined) {
                setErrorMessage(address.error)
            } else {
                setErrorMessage(ecpairPriv.error)
            }
        }
    };
    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                The recipient’s address should start with XPRTa123…..
            </Popover.Content>
        </Popover>
    );
    return (
        <div className="send-container">
            <div className="form-section">
                <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmit}>
                    <div className="form-field">
                        <p className="label info">Recipient Address
                            <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
                                <button className="icon-button info"><Icon
                                    viewClass="arrow-right"
                                    icon="info"/></button>
                            </OverlayTrigger></p>
                        <Form.Control
                            type="text"
                            name="address"
                            placeholder="Enter Recipient's address "
                            required={true}
                        />
                    </div>
                    <div className="form-field">
                        <p className="label">Send Amount</p>
                        <div className="amount-field">
                            <Form.Control
                                type="number"
                                min={0}
                                name="amount"
                                placeholder="Send Amount"
                                value={amountField}
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
                        <button className="button button-primary">Send XPRT Tokens</button>
                    </div>
                </Form>
            </div>

            {
                mnemonicForm ?
                    <Modal show={show} onHide={handleClose} centered className="create-wallet-modal">
                        {
                            txResponse === '' ?
                                <Modal.Body className="create-wallet-body import-wallet-body">
                                    <h3 className="heading">Send Token
                                    </h3>
                                    <Form onSubmit={handleMnemonicSubmit}>
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
                                                                id="sendAccountNumber"
                                                                placeholder="Account number"
                                                                required={advanceMode ? true : false}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <p className="label">Account Index</p>
                                                            <Form.Control
                                                                type="text"
                                                                name="privateAccountIndex"
                                                                id="sendAccountIndex"
                                                                placeholder="Account Index"
                                                                required={advanceMode ? true : false}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <p className="label">bip39Passphrase</p>
                                                            <Form.Control
                                                                type="password"
                                                                name="bip39Passphrase"
                                                                id="sendbip39Passphrase"
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
                                            <button className="button button-primary">Send</button>
                                        </div>
                                    </Form>

                                </Modal.Body>
                                : <>
                                    {
                                        txResponse.code === undefined ?
                                            <>
                                                <Modal.Header className="result-header success">
                                                    Successfully Send!
                                                </Modal.Header>
                                                <Modal.Body className="delegate-modal-body">
                                                    <div className="result-container">
                                                        <img src={success} alt="success-image"/>
                                                        <p className="tx-hash">Tx Hash: {txResponse.txhash}</p>
                                                        <div className="buttons">
                                                            <button className="button" onClick={handleClose}>Done</button>
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                            </>
                                            : <>
                                                <Modal.Header className="result-header error">
                                                    Failed to Send
                                                </Modal.Header>
                                                <Modal.Body className="delegate-modal-body">
                                                    <div className="result-container">
                                                        <p className="tx-hash">Tx Hash:
                                                            {txResponse.txhash}</p>
                                                        <p>{txResponse.raw_log}</p>
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
                    : null
            }
        </div>
    );
};
export default Send;
