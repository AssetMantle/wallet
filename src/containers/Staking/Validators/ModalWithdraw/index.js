import {Accordion, AccordionContext, Card, Form, Modal, useAccordionToggle} from 'react-bootstrap';
import React, {useContext, useState} from 'react';
import success from "../../../../assets/images/success.svg";
import Icon from "../../../../components/Icon";
import MakePersistence from "../../../../utils/cosmosjsWrapper";
import aminoMsgHelper from "../../../../utils/aminoMsgHelper";
import protoMsgHelper from "../../../../utils/protoMsgHelper";
import KeplerTransaction from "../../../../utils/KeplerTransactions";

const ModalWithdraw = (props) => {
    const [response, setResponse] = useState('');
    const [advanceMode, setAdvanceMode] = useState(false);
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [memoContent, setMemoContent] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const handleClose = () => {
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

    const handleSubmitInitialData = async event => {
        event.preventDefault();
        const memo = event.target.memo.value;
        setMemoContent(memo);
        setInitialModal(false);
        showSeedModal(true);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        // const password = event.target.password.value;
        const mnemonic = event.target.mnemonic.value;
        const validatorAddress = props.validatorAddress;
        const address = localStorage.getItem('address');
        const mode = localStorage.getItem('loginMode');
        if (mode === "kepler") {
            const response = KeplerTransaction([protoMsgHelper.msgWithdraw(address, validatorAddress)], aminoMsgHelper.fee(5000, 250000), memoContent);
            response.then(result => {
                console.log(result)
            }).catch(err => console.log(err.message, "delegate error"))
        } else {
            let accountNumber = 0;
            let addressIndex = 0;
            let bip39Passphrase = "";
            if (advanceMode) {
                accountNumber = document.getElementById('claimAccountNumber').value;
                addressIndex = document.getElementById('claimAccountIndex').value;
                bip39Passphrase = document.getElementById('claimbip39Passphrase').value;
            }
            const persistence = MakePersistence(accountNumber, addressIndex);
            const address = persistence.getAddress(mnemonic, bip39Passphrase, true);
            const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);

            if (address.error === undefined && ecpairPriv.error === undefined) {
                persistence.getAccounts(address).then(data => {
                    if (data.code === undefined) {
                        let stdSignMsg = persistence.newStdMsg({
                            msgs: aminoMsgHelper.msgs(aminoMsgHelper.withDrawMsg(address, validatorAddress)),
                            chain_id: persistence.chainId,
                            fee: aminoMsgHelper.fee(5000, 250000),
                            memo: memoContent,
                            account_number: String(data.account.account_number),
                            sequence: String(data.account.sequence)
                        });

                        const signedTx = persistence.sign(stdSignMsg, ecpairPriv);
                        persistence.broadcast(signedTx).then(response => {
                            setResponse(response);
                            console.log(response)
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

    return (
        <>
            {initialModal ?
                <>
                    <Modal.Header closeButton>
                        Claim Staking Rewards
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={handleSubmitInitialData}>
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
                                <button
                                    className={props.rewards ? "button button-primary" : "button button-primary disabled"}
                                    disabled={props.rewards ? false : true}>Next
                                </button>
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {seedModal ?
                <>
                    <Modal.Header closeButton>
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
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">Account Index</p>
                                                <Form.Control
                                                    type="text"
                                                    name="privateAccountIndex"
                                                    id="claimAccountIndex"
                                                    placeholder="Account Index"
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">bip39Passphrase</p>
                                                <Form.Control
                                                    type="password"
                                                    name="bip39Passphrase"
                                                    id="claimbip39Passphrase"
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
                        <Modal.Header className="result-header success" closeButton>
                            Successfully Claimed Rewards!
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
            }
            {
                response !== '' && response.code !== undefined ?
                    <>
                        <Modal.Header className="result-header error" closeButton>
                            Failed to Claimed Rewards
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
        </>
    );
};


export default ModalWithdraw;
