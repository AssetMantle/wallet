import {Accordion, AccordionContext, Card, Form, Modal, useAccordionToggle} from 'react-bootstrap';
import React, {useState, useEffect, useContext} from 'react';
import success from "../../../assets/images/success.svg";
import icon from "../../../assets/images/icon.svg";
import {getValidatorUrl} from "../../../constants/url";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from "axios";
import Icon from "../../../components/Icon";
import MakePersistence from "../../../utils/cosmosjsWrapper";
import Actions from "../../../utils/actions";
import {connect} from "react-redux";
import helper from "../../../utils/helper";
import Loader from "../../../components/Loader";
import {WithdrawMsg} from "../../../utils/protoMsgHelper";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import transactions from "../../../utils/transactions";

const ModalWithdraw = (props) => {
    const ActionHelper = new Actions();
    const [show, setShow] = useState(true);
    const [validatorAddress, setValidatorAddress] = useState('');
    const [response, setResponse] = useState('');
    const [validatorsList, setValidatorsList] = useState([]);
    const [advanceMode, setAdvanceMode] = useState(false);
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [individualRewards, setIndividualRewards] = useState('');
    const [memoContent, setMemoContent] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const address = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');
    useEffect(() => {
        for (const item of props.list) {
            const validatorUrl = getValidatorUrl(item.validator_address);
            axios.get(validatorUrl).then(validatorResponse => {
                let validator = validatorResponse.data.validator;
                setValidatorsList(validatorsList => [...validatorsList, validator]);
            })
        }
    }, []);
    const handleClose = (amount) => {
        setShow(false);
        props.setRewards(false)
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
    function PrivateKeyReader(file, password) {
        return new Promise(function (resolve, reject) {
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = event => {
                const res = JSON.parse(event.target.result);
                const decryptedData = helper.decryptStore(res, password);
                if (decryptedData.error != null) {
                    setErrorMessage(decryptedData.error)
                } else {
                    resolve(decryptedData.mnemonic);
                    setErrorMessage("");
                }
            };
        });
    }
    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        setInitialModal(false);
        const response = transactions.TransactionWithKeplr([WithdrawMsg(address, validatorAddress)], aminoMsgHelper.fee(5000, 250000));
        response.then(result => {
            console.log(result);
            setResponse(result);
            setLoader(false)
        }).catch(err => {
            setLoader(false);
            props.handleClose();
            console.log(err.message, "Withdraw error")
        })
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
        const validatorAddress = props.validatorAddress;
            let accountNumber = 0;
            let addressIndex = 0;
            let bip39Passphrase = "";
            if (advanceMode) {
                accountNumber = document.getElementById('claimTotalAccountNumber').value;
                addressIndex = document.getElementById('claimTotalAccountIndex').value;
                bip39Passphrase = document.getElementById('claimTotalbip39Passphrase').value;
            }
            const persistence = MakePersistence(accountNumber, addressIndex);
            const address = persistence.getAddress(mnemonic, bip39Passphrase, true);
            const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);

            if (address.error === undefined && ecpairPriv.error === undefined) {
                persistence.getAccounts(address).then(data => {
                    if (data.code === undefined) {
                        let stdSignMsg = persistence.newStdMsg({
                            msgs: helper.msgs(helper.withDrawMsg(address, validatorAddress)),
                            chain_id: persistence.chainId,
                            fee: helper.fee(5000, 250000),
                            memo: memoContent,
                            account_number: String(data.account.account_number),
                            sequence: String(data.account.sequence)
                        });

                        const signedTx = persistence.sign(stdSignMsg, ecpairPriv);
                        persistence.broadcast(signedTx).then(response => {
                            setResponse(response);
                            console.log(response.code)
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
    const onChangeSelect = (evt) => {
        setValidatorAddress(evt.target.value)
        let rewards = ActionHelper.getValidatorRewards(evt.target.value);
        rewards.then(function (response) {
            setIndividualRewards(response);
            console.log(response, "Rewards")
        })
    };

    const handlePrivateKey = (value) => {
        setImportMnemonic(value);
        setErrorMessage("");
    };
    if (loader) {
        return <Loader/>;
    }
    return (
        <Modal
            animation={false}
            centered={true}
            keyboard={false}
            show={show}
            className="modal-custom claim-rewards-modal"
            onHide={handleClose}>
            {initialModal ?
                <>
                    <Modal.Header>
                        Claiming Rewards
                    </Modal.Header>
                    <Modal.Body className="rewards-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                            <div className="form-field">
                                <p className="label">Select Validator</p>

                                <Select value={validatorAddress} className="validators-list-selection"
                                        onChange={onChangeSelect} displayEmpty>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {/*<MenuItem value="all" key={0}>*/}
                                    {/*    <em>all</em>*/}
                                    {/*</MenuItem>*/}
                                    {
                                        validatorsList.map((validator, index) => (
                                            <MenuItem
                                                key={index + 1}
                                                className=""
                                                value={validator.operator_address}>
                                                {validator.description.moniker}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </div>
                            <div className="form-field">
                                <p className="label"></p>
                                <div className="available-tokens">
                                    <p className="tokens">{individualRewards} <span>XPRT</span></p>
                                    <p className="usd">=${(individualRewards * 0.4).toFixed(4)}</p>
                                </div>
                            </div>
                            <div className="form-field">
                                <p className="label">Total Available</p>
                                <div className="available-tokens">
                                    <img src={icon} alt="icon"/>
                                    <p className="tokens">{props.totalRewards} <span>XPRT</span></p>
                                    <p className="usd">=${(props.totalRewards * 0.4).toFixed(4)}</p>
                                </div>
                            </div>
                            <div className="form-field">
                                <p className="label">Memo</p>
                                <Form.Control as="textarea" rows={3} name="memo"
                                              placeholder="Enter Memo"
                                              required={false}/>
                            </div>
                            <div className="buttons">
                                <button className="button button-primary">{mode === "normal" ? "Next" : "Submit"}</button>
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
                    <Modal.Body className="rewards-modal-body">
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
                                                    name="privateAccountNumber"
                                                    id="claimTotalAccountNumber"
                                                    placeholder="Account number"
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">Account Index</p>
                                                <Form.Control
                                                    type="text"
                                                    name="privateAccountIndex"
                                                    id="claimTotalAccountIndex"
                                                    placeholder="Account Index"
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">bip39Passphrase</p>
                                                <Form.Control
                                                    type="password"
                                                    name="bip39Passphrase"
                                                    id="claimTotalbip39Passphrase"
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
                        <Modal.Header className="result-header success">
                            Successfully Delegated!
                        </Modal.Header>
                        <Modal.Body className="delegate-modal-body">
                            <div className="result-container">
                                <img src={success} alt="success-image"/>
                                {mode === "kepler" ?
                                    <p className="tx-hash">Tx Hash: {response.transactionHash}</p>
                                    : <p className="tx-hash">Tx Hash: {response.txhash}</p>}
                                <div className="buttons">
                                    <button className="button" onClick={handleClose}>Done</button>
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
                                {mode === "kepler" ?
                                    <p className="tx-hash">Tx Hash: {response.transactionHash}</p>
                                    : <p className="tx-hash">Tx Hash: {response.txhash}</p>}
                                {mode === "kepler" ?
                                    <p>{response.rawLog}</p>
                                    : <p>{response.raw_log}</p>}
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

const stateToProps = (state) => {
    return {
        list: state.rewards.list,
    };
};

export default connect(stateToProps)(ModalWithdraw);
