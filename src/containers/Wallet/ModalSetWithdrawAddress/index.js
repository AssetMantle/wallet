import {Accordion, AccordionContext, Card, Form, Modal, useAccordionToggle} from 'react-bootstrap';
import React, {useContext, useEffect, useState} from 'react';
import success from "../../../assets/images/success.svg";
import {getValidatorUrl} from "../../../constants/url";
import axios from "axios";
import Icon from "../../../components/Icon";
import {connect} from "react-redux";
import helper from "../../../utils/helper";
import Loader from "../../../components/Loader";
import {SetWithDrawAddressMsg} from "../../../utils/protoMsgHelper";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import transactions from "../../../utils/transactions";
import MakePersistence from "../../../utils/cosmosjsWrapper";
import config from "../../../config";
import {useTranslation} from "react-i18next";
import {fetchWithdrawAddress} from "../../../actions/withdrawAddress";

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;

const ModalSetWithdrawAddress = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [validatorAddress, setValidatorAddress] = useState('');
    const [response, setResponse] = useState('');
    const [validatorsList, setValidatorsList] = useState([]);
    const [advanceMode, setAdvanceMode] = useState(false);
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [memoContent, setMemoContent] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const loginAddress = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');
    useEffect(() => {
        props.fetchWithdrawAddress(loginAddress)
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
        props.setWithDraw(false)
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
        const response = transactions.TransactionWithKeplr([SetWithDrawAddressMsg(loginAddress, event.target.withdrawalAddress.value)], aminoMsgHelper.fee(5000, 250000));
        response.then(result => {
            if(result.code !== undefined){
                helper.AccountChangeCheck(result.rawLog)
            }
            setInitialModal(false);
            setResponse(result);
            setLoader(false)
        }).catch(err => {
            setLoader(false);
            helper.AccountChangeCheck(err.message);
            setErrorMessage(err.message);
        })
    };
    const handleSubmitInitialData = async event => {
        event.preventDefault();
        const memo = event.target.memo.value;
        let memoCheck = transactions.mnemonicValidation(memo, loginAddress);
        if (memoCheck) {
            setErrorMessage("you entered your mnemonic as memo")
        } else {
            setValidatorAddress(event.target.withdrawalAddress.value);
            setMemoContent(memo);
            setInitialModal(false);
            showSeedModal(true);
            setErrorMessage("")
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
                            msgs: aminoMsgHelper.msgs(aminoMsgHelper.setWithdrawAddressMsg(address, validatorAddress)),
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
                            console.log(response, "delegate response")
                        }).catch(err => {
                            setLoader(false);
                            setErrorMessage(err.message);
                            console.log(err.message, "delegate error")
                        });
                        showSeedModal(false);
                    } else {
                        setLoader(false);
                        setAdvanceMode(false);
                        setErrorMessage(data.message);
                    }
                });
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
            backdrop="static"
            show={show}
            className="modal-custom claim-rewards-modal"
            onHide={handleClose}>
            {initialModal ?
                <>
                    <Modal.Header closeButton>
                        Set Rewards Withdraw Address
                    </Modal.Header>
                    <Modal.Body className="rewards-modal-body">
                        <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                            <div className="form-field">
                                <p className="label">Current rewards withdrawal address</p>
                                <Form.Control
                                    type="text"
                                    name="currentWithdrawalAddress"
                                    placeholder={t("ENTER_WITHDRAW_ADDRESS")}
                                    value={props.withdrawAddress}
                                />
                            </div>
                            <div className="form-field">
                                <p className="label">{t("WITHDRAW_ADDRESS")}</p>
                                <Form.Control
                                    type="text"
                                    name="withdrawalAddress"
                                    placeholder={t("ENTER_WITHDRAW_ADDRESS")}
                                    required={true}
                                />
                            </div>
                            {mode === "normal" ?
                                <div className="form-field">
                                    <p className="label">{t("MEMO")}</p>
                                    <Form.Control
                                        type="text"
                                        name="memo"
                                        placeholder={t("ENTER_MEMO")}
                                        required={false}
                                    />
                                </div> : null
                            }
                            {
                                errorMessage !== "" ?
                                    <p className="form-error">{errorMessage}</p>
                                    : null
                            }
                            <div className="buttons">
                                <button className="button button-primary" disabled={!props.status}
                                >{mode === "normal" ? "Next" : "Submit"}</button>
                            </div>
                        </Form>
                    </Modal.Body>
                </>
                : null
            }
            {seedModal ?
                <>
                    <Modal.Header closeButton>
                        {t("SET_REWARDS_WITHDRAW_ADDRESS")}
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
                        <Modal.Header className="result-header success" closeButton>
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
                        <Modal.Header className="result-header error" closeButton>
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
                                    <button className="button" onClick={handleClose}> {t("DONE")}</button>
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
        tokenPrice: state.tokenPrice.tokenPrice,
        status: state.delegations.status,
        withdrawAddress : state.withdrawAddress.withdrawAddress
    };
};

const actionsToProps = {
    fetchWithdrawAddress
};

export default connect(stateToProps, actionsToProps)(ModalSetWithdrawAddress);
