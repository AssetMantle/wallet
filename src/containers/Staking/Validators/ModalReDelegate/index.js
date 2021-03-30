import {Accordion, AccordionContext, Card, Form, Modal, useAccordionToggle} from 'react-bootstrap';
import React, {useContext, useState} from 'react';
import success from "../../../../assets/images/success.svg";
import Icon from "../../../../components/Icon";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import helper from "../../../../utils/helper";
import aminoMsgHelper from "../../../../utils/aminoMsgHelper";
import {RedelegateMsg} from "../../../../utils/protoMsgHelper";
import {connect} from "react-redux";
import transactions from "../../../../utils/transactions";
import Loader from "../../../../components/Loader";

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;
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
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [loader, setLoader] = useState(false);
    const address = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');

    const handleAmountChange = (evt) => {
        let rex = /^\d*\.?\d{0,2}$/;
        if (rex.test(evt.target.value)){
            setAmount(evt.target.value)
        } else {
            return false
        }
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
    const handlePrivateKey = (value) => {
        setImportMnemonic(value);
        setErrorMessage("");
    };
    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        setInitialModal(false);
        const response = transactions.TransactionWithKeplr([RedelegateMsg(address, props.validatorAddress, toValidatorAddress, (amount * 1000000))], aminoMsgHelper.fee(0, 250000));
        response.then(result => {
            setResponse(result);
            setLoader(false)
        }).catch(err => {
            setLoader(false);
            props.handleClose();
            console.log(err.message, "delegate error")
        })
    };

    function PrivateKeyReader(file, password) {
        return new Promise(function (resolve, reject) {
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = event => {
                const res = JSON.parse(event.target.result);
                const decryptedData = helper.decryptStore(res, password);
                if (decryptedData.error != null) {
                    setErrorMessage(decryptedData.error);
                    setLoader(false);
                } else {
                    resolve(decryptedData.mnemonic);
                    setErrorMessage("");
                }
            };
        });
    }

    const handleSubmit = async event => {
            setLoader(true);
            event.preventDefault();
            let mnemonic;
            if (importMnemonic) {
                mnemonic = event.target.mnemonic.value;
            } else {
                const password = event.target.password.value;
                var promise = PrivateKeyReader(event.target.uploadFile.files[0], password);
                await promise.then(function (result) {
                    mnemonic = result;
                });
            }

            let accountNumber = 0;
            let addressIndex = 0;
            let bip39Passphrase = "";
            if (advanceMode) {
                accountNumber = document.getElementById('redelegateAccountNumber').value;
                addressIndex = document.getElementById('redelegateAccountIndex').value;
                bip39Passphrase = document.getElementById('redelegatebip39Passphrase').value;
            }
            let addressFromMnemonic = transactions.CheckAddressMisMatch(mnemonic, transactions.makeHdPath(accountNumber, addressIndex), bip39Passphrase);
            addressFromMnemonic.then((addressResponse) => {
                if (address === addressResponse) {
                    const response = transactions.TransactionWithMnemonic([RedelegateMsg(address, props.validatorAddress, toValidatorAddress, (amount * 1000000))], aminoMsgHelper.fee(5000, 250000), memoContent,
                        mnemonic, transactions.makeHdPath(accountNumber, addressIndex), bip39Passphrase);
                    response.then(result => {
                        showSeedModal(false);
                        setResponse(result);
                        setLoader(false);
                    }).catch(err => {
                        setLoader(false);
                        setErrorMessage(err.message)
                        console.log(err.message, "redelegate error")
                    })
                } else {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage("Please check mnemonic or wallet path")
                }
            }).catch(err => {
                setLoader(false);
                setAdvanceMode(false);
                setErrorMessage("Please check mnemonic or wallet path")
            })
        }
    ;
    if (loader) {
        return <Loader/>;
    }
    const disabled = (
        helper.ValidateFrom(toValidatorAddress).message !== ''
    );
    return (
        <>
            {initialModal ?
                <>
                    <Modal.Header closeButton>
                        redelegating from {props.moniker}
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
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
                                <p className="label"> Delegation Amount(XPRT)</p>
                                <Form.Control
                                    type="number"
                                    placeholder="Amount"
                                    value={props.delegationAmount}
                                    disabled
                                />
                            </div>
                            <div className="form-field">
                                <p className="label">Redelegation Amount(XPRT)</p>
                                <div className="amount-field">
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        name="amount"
                                        placeholder="Send Amount"
                                        value={amount}
                                        step="any"
                                        onChange={handleAmountChange}
                                        required={true}
                                    />
                                </div>
                            </div>
                            {mode === "normal" ?
                                <div className="form-field">
                                    <p className="label">Memo</p>
                                    <Form.Control as="textarea" rows={3} name="memo"
                                                  placeholder="Enter Memo"
                                                  required={false}/>
                                </div> : null
                            }
                            <div className="buttons navigate-buttons">
                                <button className="button button-secondary" onClick={() => handlePrevious()}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                                <button
                                    className={props.delegateStatus ? "button button-primary" : "button button-primary disabled"}
                                    disabled={!props.delegateStatus || disabled || amount === 0}
                                >{mode === "normal" ? "Next" : "Submit"}
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
                        redelegating from {props.moniker}
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={handleSubmit}>
                            {
                                importMnemonic ?
                                    <>
                                        <div className="text-center">
                                            <p onClick={() => handlePrivateKey(false)}
                                               className="import-name">Use
                                                Private Key (KeyStore.json file)</p>
                                        </div>
                                        <div className="form-field">
                                            <p className="label">Mnemonic</p>
                                            <Form.Control as="textarea" rows={3} name="mnemonic"
                                                          placeholder="Enter Mnemonic"
                                                          required={true}/>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="text-center">
                                            <p onClick={() => handlePrivateKey(true)}
                                               className="import-name">Use
                                                Mnemonic (Seed Phrase)</p>
                                        </div>
                                        <div className="form-field">
                                            <p className="label">Password</p>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder="Enter Password"
                                                required={true}
                                            />
                                        </div>
                                        <div className="form-field upload">
                                            <p className="label"> KeyStore file</p>
                                            <Form.File id="exampleFormControlFile1" name="uploadFile"
                                                       className="file-upload" accept=".json" required={true}/>
                                        </div>

                                    </>

                            }
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
                                <p className="fee"> Default fee of 0.005xprt will be cut from the wallet.</p>
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
                                <a
                                    href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                    target="_blank" className="tx-hash">Tx
                                    Hash: {response.transactionHash}</a>
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
                                <a
                                    href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                    target="_blank" className="tx-hash">Tx
                                    Hash: {response.transactionHash}</a>
                                {mode === "kepler" ?
                                    <p>{response.rawLog}</p>
                                    : <p>{response.rawLog}</p>}
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

const stateToProps = (state) => {
    return {
        validators: state.validators.validators,
        balance: state.balance.amount,
    };
};

export default connect(stateToProps)(ModalReDelegate);
