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
import aminoMsgHelper from "../../../../utils/aminoMsgHelper";
import {DelegateMsg} from "../../../../utils/protoMsgHelper";
import transactions from "../../../../utils/transactions";
import helper from "../../../../utils/helper";
import Loader from "../../../../components/Loader";
import {connect} from "react-redux";
import MakePersistence from "../../../../utils/cosmosjsWrapper";
const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;
const ModalDelegate = (props) => {
    const [amount, setAmount] = useState(0);
    const [show, setShow] = useState(true);
    const [memoContent, setMemoContent] = useState('');
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [response, setResponse] = useState('');
    const [advanceMode, setAdvanceMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const loginAddress = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');

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
        let rex = /^\d*\.?\d{0,2}$/;
        if (rex.test(evt.target.value)) {
            setAmount(evt.target.value)
        } else {
            return false
        }
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

    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        setInitialModal(false);
        const response = transactions.TransactionWithKeplr([DelegateMsg(loginAddress, props.validatorAddress, (amount * 1000000))], aminoMsgHelper.fee(0, 250000), memoContent);
        response.then(result => {
            setResponse(result);
            setLoader(false)
        }).catch(err => {
            setLoader(false);
            props.handleClose();
            console.log(err.message, "delegate error")
        })
    };

    const handleSubmitInitialData = async event => {
        event.preventDefault();
        const memo = event.target.memo.value;
        setMemoContent(memo);
        setInitialModal(false);
        showSeedModal(true);
    };

    function PrivateKeyReader(file, password) {
        return new Promise(function (resolve, reject) {
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = event => {
                const res = JSON.parse(event.target.result);
                const decryptedData = helper.decryptStore(res, password);
                if (decryptedData.error != null) {
                    setErrorMessage(decryptedData.error)
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
            accountNumber = event.target.delegateAccountNumber.value;
            addressIndex = event.target.delegateAccountIndex.value;
            bip39Passphrase = event.target.delegatebip39Passphrase.value;
        }
        const persistence = MakePersistence(accountNumber, addressIndex);
        const address = persistence.getAddress(mnemonic, bip39Passphrase, true);
        const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);
        console.log(address.error, "rdsult");
        if (address.error === undefined && ecpairPriv.error === undefined) {
            if(address === loginAddress) {
                persistence.getAccounts(address).then(data => {
                    if (data.code === undefined) {
                        let stdSignMsg = persistence.newStdMsg({
                            msgs: aminoMsgHelper.msgs(aminoMsgHelper.delegateMsg((amount * 1000000), address, props.validatorAddress)),
                            fee: aminoMsgHelper.fee(5000, 250000),
                            chain_id: persistence.chainId,
                            memo: memoContent,
                            account_number: String(data.account.account_number),
                            sequence: String(data.account.sequence)
                        });
                        const signedTx = persistence.sign(stdSignMsg, ecpairPriv);
                        persistence.broadcast(signedTx).then(response => {
                            setResponse(response);
                            setLoader(false);
                            showSeedModal(false);
                            setAdvanceMode(false);
                            console.log(response, "delegate response")
                        }).catch(err => {
                            setLoader(false);
                            setErrorMessage(err.message);
                            console.log(err.message, "delegate error")
                        })
                        showSeedModal(false);
                    } else {
                        setLoader(false);
                        setAdvanceMode(false);
                        setErrorMessage(data.message);
                    }
                });
            }else {
                setLoader(false);
                setAdvanceMode(false);
                setErrorMessage("Mnemonic not matched")
            }
        } else {
            if (address.error !== undefined) {
                setLoader(false);
                setAdvanceMode(false);
                setErrorMessage(address.error)
            } else {
                setLoader(false);
                setAdvanceMode(false);
                setErrorMessage(ecpairPriv.error)
            }
        }

    };
    const handlePrivateKey = (value) => {
        setImportMnemonic(value);
        setErrorMessage("");
    };
    if (loader) {
        return <Loader/>;
    }
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
                        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
                            <button className="icon-button info"><Icon
                                viewClass="arrow-right"
                                icon="info"/></button>
                        </OverlayTrigger>
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                            <div className="form-field">
                                <p className="label">Delegation Amount(XPRT)</p>
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
                            <div className="form-field">
                                <p className="label">Balance(XPRT)</p>
                                <Form.Control
                                    type="number"
                                    placeholder="Amount"
                                    value={props.balance}
                                    disabled
                                />
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
                                <button className="button button-primary"
                                        disabled={amount > (props.balance * 1) || amount === 0 || (props.balance * 1) === 0}
                                > {mode === "normal" ? "Next" : "Submit"}</button>
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
                        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
                            <button className="icon-button info"><Icon
                                viewClass="arrow-right"
                                icon="info"/></button>
                        </OverlayTrigger>
                    </Modal.Header>
                    <Modal.Body className="delegate-modal-body">
                        <Form onSubmit={handleSubmit}>

                            {
                                importMnemonic ?
                                    <>
                                        <div className="text-center">
                                            <p onClick={() => handlePrivateKey(false)} className="import-name">Use
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
                                            <p onClick={() => handlePrivateKey(true)} className="import-name">Use
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
                                                    name="delegateAccountNumber"
                                                    id="delegateAccountNumber"
                                                    placeholder="Account number"
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">Account Index</p>
                                                <Form.Control
                                                    type="text"
                                                    name="delegateAccountIndex"
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
                                <p className="fee"> Default fee of 0.005xprt will be cut from the wallet.</p>
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
                                {mode === "kepler" ?
                                    <a
                                        href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                        target="_blank" className="tx-hash">Tx
                                        Hash: {response.transactionHash}</a>
                                    :
                                    <a
                                        href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                        target="_blank" className="tx-hash">Tx
                                        Hash: {response.txhash}</a>
                                }
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
                            {mode === "kepler" ?
                                <>
                                    <p>{response.rawLog}</p>
                                    <a
                                        href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                        target="_blank" className="tx-hash">Tx
                                        Hash: {response.transactionHash}</a>
                                </>
                                :
                                <>
                                    <p>{response.raw_log}</p>
                                    <a
                                        href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                        target="_blank" className="tx-hash">Tx
                                        Hash: {response.txhash}</a>
                                </>
                            }
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
        balance: state.balance.amount,
    };
};

export default connect(stateToProps)(ModalDelegate);
