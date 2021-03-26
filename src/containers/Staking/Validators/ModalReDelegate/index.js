    import {
        Accordion,
        AccordionContext,
        Card,
        Form,
        Modal,
        useAccordionToggle
    } from 'react-bootstrap';
    import React, {useState, useEffect, useContext} from 'react';
    import success from "../../../../assets/images/success.svg";
    import Icon from "../../../../components/Icon";
    import MakePersistence from "../../../../utils/cosmosjsWrapper";
    import Select from "@material-ui/core/Select";
    import MenuItem from "@material-ui/core/MenuItem";
    import helper from "../../../../utils/helper";
    import {connect} from "react-redux";

    const ModalReDelegate = (props) => {
        const [amount, setAmount] = useState(0);
        const [show, setShow] = useState(true);
        const [memoContent, setMemoContent] = useState('');
        const [initialModal, setInitialModal] = useState(true);
        const [seedModal, showSeedModal] = useState(false);
        const [response, setResponse] = useState('');
        const [toValidatorAddress, setToValidatorAddress] = useState("");
        const [advanceMode, setAdvanceMode] = useState(false);
        const [errorMessage, setErrorMessage] = useState("");

        const handleAmount = (amount) => {
            setAmount(amount)
        };

        const handleAmountChange = (evt) => {
            setAmount(evt.target.value)
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

        const onChangeSelect = (evt) => {
            setToValidatorAddress(evt.target.value)
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

            let accountNumber = 0;
            let addressIndex = 0;
            let bip39Passphrase = "";
            if (advanceMode) {
                accountNumber = document.getElementById('redelegateAccountNumber').value;
                addressIndex = document.getElementById('redelegateAccountIndex').value;
                bip39Passphrase = document.getElementById('redelegatebip39Passphrase').value;
            }
            const persistence = MakePersistence(accountNumber, addressIndex);
            const address = persistence.getAddress(mnemonic, bip39Passphrase, true);
            const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);

            if (address.error === undefined && ecpairPriv.error === undefined) {
                persistence.getAccounts(address).then(data => {
                    if (data.code === undefined) {
                        let stdSignMsg = persistence.newStdMsg({
                            msgs: [
                                {
                                    type: "cosmos-sdk/MsgBeginRedelegate",
                                    value: {
                                        amount: {
                                            amount: String(1000000),
                                            denom: "uxprt"
                                        },
                                        delegator_address: address,
                                        validator_dst_address: toValidatorAddress,
                                        validator_src_address: validatorAddress
                                    }
                                }
                            ],
                            chain_id: persistence.chainId,
                            fee: {amount: [{amount: String(5000), denom: "uxprt"}], gas: String(250000)},
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
        };
        const disabled = (
            helper.ValidateFrom(toValidatorAddress).message !== ''
        );
        return (
            <>
                {initialModal ?
                    <>
                        <Modal.Header closeButton>
                            {props.moniker}
                        </Modal.Header>
                        <Modal.Body className="delegate-modal-body">
                            <Form onSubmit={handleSubmitInitialData}>
                                <div className="form-field">
                                    <p className="label">Redelegate to</p>
                                    <Select value={toValidatorAddress} className="validators-list-selection"
                                            onChange={onChangeSelect} displayEmpty>
                                        <MenuItem value="" key={0}>
                                            <em>Select validator</em>
                                        </MenuItem>
                                        {
                                            props.validators.map((validator, index) => {
                                                if (validator.description.moniker !== props.moniker) {
                                                    return (
                                                        <MenuItem
                                                            key={index + 1}
                                                            className=""
                                                            value={validator.operator_address}>
                                                            {validator.description.moniker}
                                                        </MenuItem>
                                                    )
                                                }
                                            })
                                        }
                                    </Select>
                                </div>
                                <div className="form-field">
                                    <p className="label">Available Amount</p>
                                    <Form.Control
                                        type="number"
                                        placeholder="Amount"
                                        value={props.balance}
                                        disabled
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
                                    <button
                                        className={props.delegateStatus ? "button button-primary" : "button button-primary disabled"}
                                        disabled={!props.delegateStatus || disabled || amount > props.balance || amount === 0}
                                    >Next
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
                            {props.moniker}
                        </Modal.Header>
                        <Modal.Body className="delegate-modal-body">
                            <Form onSubmit={handleSubmit}>
                                <div className="form-field">
                                    <p className="label">Mnemonic</p>
                                    <Form.Control as="textarea" rows={3} name="mnemonic"
                                                  placeholder="Enter Mnemonic"
                                                  required={false}/>
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
                                                        id="redelegateAccountNumber"
                                                        placeholder="Account number"
                                                        required={advanceMode ? true : false}
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <p className="label">Account Index</p>
                                                    <Form.Control
                                                        type="text"
                                                        name="privateAccountIndex"
                                                        id="redelegateAccountIndex"
                                                        placeholder="Account Index"
                                                        required={advanceMode ? true : false}
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <p className="label">bip39Passphrase</p>
                                                    <Form.Control
                                                        type="password"
                                                        name="redelegatebip39Passphrase"
                                                        id="redelegatebip39Passphrase"
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
                                    <button className="button button-primary">Redelegate</button>
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
                                Successfully Redelegated!
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
                                Failed to Redelegated
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

    const stateToProps = (state) => {
        return {
            validators: state.validators.validators,
            balance: state.balance.amount,
        };
    };

    export default connect(stateToProps)(ModalReDelegate);
