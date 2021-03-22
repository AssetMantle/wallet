import {Accordion, AccordionContext, Card, Form, Modal, useAccordionToggle} from 'react-bootstrap';
import React, {useState, useEffect, useContext} from 'react';
import success from "../../../assets/images/success.svg";
import icon from "../../../assets/images/icon.svg";
import {getDelegationsUrl, getValidatorUrl} from "../../../constants/url";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from "axios";
import Icon from "../../../components/Icon";
import MakePersistence from "../../../utils/cosmosjsWrapper";
import Lodash from "lodash";

const ModalWithdraw = (props) => {
    const [show, setShow] = useState(true);
    const [validatorAddress, setValidatorAddress] = useState('');
    const [response, setResponse] = useState('');
    const [validatorsList, setValidatorsList] = useState([]);
    const [advanceMode, setAdvanceMode] = useState(false);
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [memoContent, setMemoContent] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        const fetchValidators = async () => {
            const address = localStorage.getItem('address');
            const delegationsUrl = getDelegationsUrl(address);
            await axios.get(delegationsUrl).then(response => {
                let delegationResponseList = response.data.delegation_responses;
                let validators = [];
                for (const item of delegationResponseList) {
                    const validatorUrl = getValidatorUrl(item.delegation.validator_address);
                    const validatorResponse = axios.get(validatorUrl);
                    validators.push(validatorResponse.data.validator);
                }
                setValidatorsList(validators);
            }).catch(error => {
                console.log(error.response, "error delegationsUrl")
            });
        };
        fetchValidators();
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
                        fee: {amount: [{amount: String(5000), denom: "uxprt"}], gas: String(250000)},
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
            }
            else {
                setErrorMessage(ecpairPriv.error)
            }
        }

    };
    const onChangeSelect = (evt) => {
        setValidatorAddress(evt.target.value)
    };
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
                        <Form onSubmit={handleSubmitInitialData}>
                            <div className="form-field">
                                <p className="label">Select Validator</p>

                                <Select value={validatorAddress} className="validators-list-selection"
                                        onChange={onChangeSelect} displayEmpty>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
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
                                <p className="label">Total Available</p>
                                <div className="available-tokens">
                                    <img src={icon} alt="icon"/>
                                    <p className="tokens">{props.totalRewards} <span>XPRT</span></p>
                                    <p className="usd">=$194.04</p>
                                </div>
                            </div>
                            <div className="form-field">
                                <p className="label">Memo</p>
                                <Form.Control as="textarea" rows={3} name="memo"
                                              placeholder="Enter Memo"
                                              required={false}/>
                            </div>
                            {/*<div className="form-field">*/}
                            {/*    <p className="label">Password</p>*/}
                            {/*    <Form.Control*/}
                            {/*        type="password"*/}
                            {/*        name="password"*/}
                            {/*        placeholder="Enter Your Wallet Password"*/}
                            {/*        required={true}*/}
                            {/*    />*/}
                            {/*</div>*/}
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
                    <Modal.Body className="rewards-modal-body">
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
                                <p className="tx-hash">Tx Hash: {response.txhash}</p>
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
