import {Accordion, AccordionContext, Card, Form, Modal, useAccordionToggle} from 'react-bootstrap';
import React, {useContext, useEffect, useState} from 'react';
import success from "../../../assets/images/success.svg";
import icon from "../../../assets/images/icon.svg";
import {getValidatorUrl} from "../../../constants/url";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from "axios";
import Icon from "../../../components/Icon";
import Actions from "../../../utils/actions";
import {connect} from "react-redux";
import helper from "../../../utils/helper";
import Loader from "../../../components/Loader";
import {WithdrawMsg} from "../../../utils/protoMsgHelper";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import transactions from "../../../utils/transactions";
import MakePersistence from "../../../utils/cosmosjsWrapper";
import config from "../../../config";
import {useTranslation} from "react-i18next";
const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;

const ModalWithdraw = (props) => {
    const {t} = useTranslation();
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
    const loginAddress = localStorage.getItem('address');
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

    const handleClose = () => {
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
                    setLoader(false);
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
        const response = transactions.TransactionWithKeplr([WithdrawMsg(loginAddress, validatorAddress)], aminoMsgHelper.fee(5000, 250000));
        response.then(result => {
            setResponse(result);
            setLoader(false)
        }).catch(err => {
            setLoader(false);
            props.setRewards(false)
            console.log(err.message, "Withdraw error")
        })
    };
    const handleSubmitInitialData = async event => {
        event.preventDefault();
        const memo = event.target.memo.value;
        let memoCheck = transactions.mnemonicValidation(memo, loginAddress)
        if(memoCheck){
            setErrorMessage("you entered your mnemonic as memo")
        }
       else {
            setErrorMessage("")
            setMemoContent(memo);
            setInitialModal(false);
            showSeedModal(true);
        }
    };
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
            accountNumber = event.target.claimTotalAccountNumber.value;
            addressIndex = event.target.claimTotalAccountIndex.value;
            bip39Passphrase = event.target.claimTotalbip39Passphrase.value;
        }
        const persistence = MakePersistence(accountNumber, addressIndex);
        const address = persistence.getAddress(mnemonic, bip39Passphrase, true);
        const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);
        if (address.error === undefined && ecpairPriv.error === undefined) {
            if (address === loginAddress) {
                persistence.getAccounts(address).then(data => {
                    if (data.code === undefined) {
                        let [accountNumber, sequence] = transactions.getAccountNumberAndSequence(data);
                        let stdSignMsg = persistence.newStdMsg({
                            msgs: aminoMsgHelper.msgs(aminoMsgHelper.withDrawMsg(address, validatorAddress)),
                            chain_id: persistence.chainId,
                            fee: aminoMsgHelper.fee(localStorage.getItem('fee'), 250000),
                            memo: memoContent,
                            account_number: String(accountNumber),
                            sequence: String(sequence)
                        });
                        const signedTx = persistence.sign(stdSignMsg, ecpairPriv, config.modeType);
                        persistence.broadcast(signedTx).then(response => {
                            setResponse(response);
                            setLoader(false);
                            showSeedModal(false);
                            setAdvanceMode(false);
                        }).catch(err => {
                            setLoader(false);
                            setErrorMessage(err.message);
                        });
                        showSeedModal(false);
                    } else {
                        setLoader(false);
                        setAdvanceMode(false);
                        setErrorMessage(data.message);
                    }
                }).catch(err => {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage(err.message);
                })
            } else {
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
    const onChangeSelect = (evt) => {
        setValidatorAddress(evt.target.value);
        let rewards = ActionHelper.getValidatorRewards(evt.target.value);
        rewards.then(function (response) {
            setIndividualRewards(response);
        })
    };

    const handlePrivateKey = (value) => {
        setImportMnemonic(value);
        setErrorMessage("");
    };

    const disabled = (
        helper.ValidateFrom(validatorAddress).message !== ''
    );

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
                        {t("CLAIM_STAKING_REWARDS")}
                    </Modal.Header>
                    <Modal.Body className="rewards-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                            <div className="form-field">
                                <p className="label">Select Validator</p>

                                <Select value={validatorAddress} className="validators-list-selection"
                                        onChange={onChangeSelect} displayEmpty>
                                    <MenuItem value="" key={0}>
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
                                <p className="label"></p>
                                <div className="available-tokens">
                                    <p className="tokens">{individualRewards} <span>XPRT</span></p>
                                    <p className="usd">=${(individualRewards * props.tokenPrice).toFixed(4)}</p>
                                </div>
                            </div>
                            <div className="form-field">
                                <p className="label">Total Available</p>
                                <div className="available-tokens">
                                    <img src={icon} alt="icon"/>
                                    <p className="tokens">{props.totalRewards} <span>XPRT</span></p>
                                    <p className="usd">=${(props.totalRewards * props.tokenPrice).toFixed(4)}</p>
                                </div>
                            </div>
                            {mode === "normal" ?
                                <div className="form-field">
                                    <p className="label">{t("MEMO")}</p>
                                    <Form.Control as="textarea" rows={3} name="memo"
                                                  placeholder={t("ENTER_MEMO")}
                                                  required={false}/>
                                </div> : null
                            }
                            {
                                errorMessage !== "" ?
                                    <p className="form-error">{errorMessage}</p>
                                    : null
                            }
                            <div className="buttons">
                                <button className="button button-primary"
                                        disabled={disabled || individualRewards === '' || individualRewards === '0.000000'}>{mode === "normal" ? "Next" : "Submit"}</button>
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {seedModal ?
                <>
                    <Modal.Header>
                        {t("CLAIM_STAKING_REWARDS")}
                    </Modal.Header>
                    <Modal.Body className="rewards-modal-body">
                        <Form onSubmit={handleSubmit}>
                            {
                                importMnemonic ?
                                    <>
                                        <div className="text-center">
                                            <p onClick={() => handlePrivateKey(false)} className="import-name">{t("USE_PRIVATE_KEY")} (KeyStore.json file)</p>
                                        </div>
                                        <div className="form-field">
                                            <p className="label">{t("MNEMONIC")}</p>
                                            <Form.Control as="textarea" rows={3} name="mnemonic"
                                                          placeholder={t("ENTER_MNEMONIC")}
                                                          required={true}/>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="text-center">
                                            <p onClick={() => handlePrivateKey(true)} className="import-name">{t("USE_MNEMONIC")} ({t("SEED_PHRASE")})</p>
                                        </div>
                                        <div className="form-field">
                                            <p className="label">{t("PASSWORD")}</p>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder={t("ENTER_PASSWORD")}
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
                                            {t("ADVANCED")}
                                        </p>
                                        <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <>
                                            <div className="form-field">
                                                <p className="label">{t("ACCOUNT")}</p>
                                                <Form.Control
                                                    type="text"
                                                    name="claimTotalAccountNumber"
                                                    id="claimTotalAccountNumber"
                                                    placeholder={t("ACCOUNT_NUMBER")}
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("ACCOUNT_INDEX")}</p>
                                                <Form.Control
                                                    type="text"
                                                    name="claimTotalAccountIndex"
                                                    id="claimTotalAccountIndex"
                                                    placeholder={t("ACCOUNT_INDEX")}
                                                    required={advanceMode ? true : false}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <p className="label">{t("BIP_PASSPHRASE")}</p>
                                                <Form.Control
                                                    type="password"
                                                    name="claimTotalbip39Passphrase"
                                                    id="claimTotalbip39Passphrase"
                                                    placeholder={t("ENTER_BIP_PASSPHRASE")}
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
                                <p className="fee"> Default fee of {parseInt(localStorage.getItem('fee')) / 1000000}xprt
                                    will be cut from the wallet.</p>
                                <button className="button button-primary">{t("CLAIM_REWARDS")}</button>
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
                            {t("SUCCESSFULLY_CLAIMED")}
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
                                        href={`${EXPLORER_API}/transaction?txHash=${response.txhash}`}
                                        target="_blank" className="tx-hash">Tx
                                        Hash: {response.txhash}</a>
                                }
                                <div className="buttons">
                                    <button className="button" onClick={handleClose}>{t("DONE")}</button>
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
                            {t("FAILED_CLAIMING")}
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
                                        <p>{response.raw_log === "panic message redacted to hide potentially sensitive system info: panic" ? "You cannot send vesting amount" : response.raw_log}</p>
                                        <a
                                            href={`${EXPLORER_API}/transaction?txHash=${response.txhash}`}
                                            target="_blank" className="tx-hash">Tx
                                            Hash: {response.txhash}</a>
                                    </>
                                }
                                <div className="buttons">
                                    <button className="button" onClick={handleClose}>{t("DONE")}</button>
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
        tokenPrice: state.tokenPrice.tokenPrice
    };
};

export default connect(stateToProps)(ModalWithdraw);
