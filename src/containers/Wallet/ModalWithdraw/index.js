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
import React, {useContext, useEffect, useState} from 'react';
import success from "../../../assets/images/success.svg";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Icon from "../../../components/Icon";
import Actions from "../../../utils/actions";
import {connect} from "react-redux";
import helper from "../../../utils/helper";
import Loader from "../../../components/Loader";
import {WithdrawMsg} from "../../../utils/protoMsgHelper";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import transactions from "../../../utils/transactions";
import MakePersistence from "../../../utils/cosmosjsWrapper";
import {useTranslation} from "react-i18next";
import ModalSetWithdrawAddress from "../ModalSetWithdrawAddress";
import config from "../../../config";
import GasContainer from "../../../components/Gas";
import {fetchValidatorsWithAddress} from "../../../actions/validators";

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;

const ModalWithdraw = (props) => {
    const {t} = useTranslation();
    const ActionHelper = new Actions();
    const [show, setShow] = useState(true);
    const [validatorAddress, setValidatorAddress] = useState('');
    const [response, setResponse] = useState('');
    const [advanceMode, setAdvanceMode] = useState(false);
    const [initialModal, setInitialModal] = useState(true);
    const [seedModal, showSeedModal] = useState(false);
    const [individualRewards, setIndividualRewards] = useState(0);
    const [memoContent, setMemoContent] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [withdraw, setWithDraw] = useState(false);
    const loginAddress = localStorage.getItem('address');
    const mode = localStorage.getItem('loginMode');
    const [memoStatus, setMemoStatus] = useState(false);
    const [showGasField, setShowGasField] = useState(false);
    const [activeFeeState, setActiveFeeState] = useState("Average");
    const [gas, setGas] = useState(config.gas);
    const [gasValidationError, setGasValidationError] = useState(false);
    const [fee, setFee] = useState(config.averageFee);
    const [checkAmountError, setCheckAmountError] = useState(false);

    const handleMemoChange = () => {
        setMemoStatus(!memoStatus);
    };
    useEffect(() => {
        props.fetchValidatorsWithAddress(props.list);
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
        setFee(gas*fee);
        if(props.transferableAmount < transactions.XprtConversion(gas*fee)){
            setCheckAmountError(true);
        }else{
            setCheckAmountError(false);
        }
    }, []);

    const handleClose = () => {
        setShow(false);
        props.setRewards(false);
    };

    function ContextAwareToggle({eventKey, callback}) {
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

    const handleSubmitKepler = async event => {
        setLoader(true);
        event.preventDefault();
        const response = transactions.TransactionWithKeplr([WithdrawMsg(loginAddress, validatorAddress)], aminoMsgHelper.fee(0, 250000));
        response.then(result => {
            if (result.code !== undefined) {
                helper.AccountChangeCheck(result.rawLog);
            }
            setInitialModal(false);
            setResponse(result);
            setLoader(false);
        }).catch(err => {
            setLoader(false);
            helper.AccountChangeCheck(err.message);
            setErrorMessage(err.message);
        });
    };
    const handleSubmitInitialData = async event => {
        event.preventDefault();
        let memo = "";
        if (memoStatus) {
            memo = event.target.memo.value;
        }
        let memoCheck = transactions.mnemonicValidation(memo, loginAddress);
        if (memoCheck) {
            setErrorMessage(t("MEMO_MNEMONIC_CHECK_ERROR"));
        } else {
            setErrorMessage("");
            setMemoContent(memo);
            setInitialModal(false);
            showSeedModal(true);
        }
        if(mode === "normal" && (localStorage.getItem("fee") * 1) === 0 ){
            setFee(0);
        }
    };
    const handleSubmit = async event => {
        setLoader(true);
        event.preventDefault();
        let mnemonic;
        let accountNumber = 0;
        let addressIndex = 0;
        let bip39Passphrase = "";
        if (advanceMode) {
            accountNumber = event.target.claimTotalAccountNumber.value;
            addressIndex = event.target.claimTotalAccountIndex.value;
            bip39Passphrase = event.target.claimTotalbip39Passphrase.value;
        }
        if (importMnemonic) {
            const password = event.target.password.value;
            let promise = transactions.PrivateKeyReader(event.target.uploadFile.files[0], password, accountNumber, addressIndex, bip39Passphrase, loginAddress);
            await promise.then(function (result) {
                mnemonic = result;
            }).catch(err => {
                setLoader(false);
                setErrorMessage(err);
            });
        } else {
            const password = event.target.password.value;
            const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
            const res = JSON.parse(encryptedMnemonic);
            const decryptedData = helper.decryptStore(res, password);
            if (decryptedData.error != null) {
                setErrorMessage(decryptedData.error);
            } else {
                mnemonic = decryptedData.mnemonic;
                setErrorMessage("");
            }
        }
        if (mnemonic !== undefined) {
            const persistence = MakePersistence(accountNumber, addressIndex);
            const address = persistence.getAddress(mnemonic, bip39Passphrase, true);
            const ecpairPriv = persistence.getECPairPriv(mnemonic, bip39Passphrase);
            if (address.error === undefined && ecpairPriv.error === undefined) {
                if (address === loginAddress) {
                    setImportMnemonic(false);
                    const response = transactions.TransactionWithMnemonic([WithdrawMsg(address, validatorAddress)], aminoMsgHelper.fee(Math.trunc(fee), gas), memoContent,
                        mnemonic, transactions.makeHdPath(accountNumber, addressIndex), bip39Passphrase);
                    response.then(result => {
                        setResponse(result);
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
                    setErrorMessage(t("ADDRESS_NOT_MATCHED_ERROR"));
                }
            } else {
                if (address.error !== undefined) {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage(address.error);
                } else {
                    setLoader(false);
                    setAdvanceMode(false);
                    setErrorMessage(ecpairPriv.error);
                }
            }
        } else {
            setLoader(false);
        }
    };
    const onChangeSelect = (evt) => {
        setValidatorAddress(evt.target.value);
        let rewards = ActionHelper.getValidatorRewards(evt.target.value);
        rewards.then(function (response) {
            setIndividualRewards(response);
        });
    };

    const handleGas = () =>{
        setShowGasField(!showGasField);
    };

    const handleGasChange = (event) =>{
        if((event.target.value * 1) >= 80000 && (event.target.value * 1) <= 2000000) {
            setGasValidationError(false);
            setGas(event.target.value * 1);
            if ((localStorage.getItem("fee") * 1) !== 0) {
                if (activeFeeState === "Average") {
                    setFee((event.target.value * 1) * config.averageFee);
                } else if (activeFeeState === "High") {
                    setFee((event.target.value * 1) * config.highFee);
                } else if (activeFeeState === "Low") {
                    setFee((event.target.value * 1) * config.lowFee);
                }

                if (activeFeeState === "Average" && (transactions.XprtConversion((event.target.value * 1) * config.averageFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "High" && (transactions.XprtConversion((event.target.value * 1) * config.highFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else if (activeFeeState === "Low" && (transactions.XprtConversion((event.target.value * 1) * config.lowFee)) > props.transferableAmount) {
                    setCheckAmountError(true);
                } else {
                    setCheckAmountError(false);
                }
            }
        }else {
            setGasValidationError(true);
        }
    };

    const handleFee = (feeType, feeValue)=>{
        setActiveFeeState(feeType);
        setFee(gas*feeValue);
    };

    const disabled = (
        helper.ValidateFrom(validatorAddress).message !== ''
    );

    if (loader) {
        return <Loader/>;
    }

    const handleRewards = (key) => {
        if (key === "setWithDraw") {
            setWithDraw(true);
            setShow(false);
        }
    };

    const handlePrevious = () => {
        setInitialModal(true);
        showSeedModal(false);
    };

    const popoverMemo = (
        <Popover id="popover-memo">
            <Popover.Content>
                {t("MEMO_NOTE")}
            </Popover.Content>
        </Popover>
    );

    const popoverSetupAddress = (
        <Popover id="popover-memo">
            <Popover.Content>
                {t("SETUP_ADDRESS_NOTE")}
            </Popover.Content>
        </Popover>
    );


    return (
        <>
            <Modal
                animation={false}
                centered={true}
                backdrop="static"
                keyboard={false}
                show={show}
                className="modal-custom claim-rewards-modal"
                onHide={handleClose}>
                {initialModal ?
                    <>
                        <Modal.Header closeButton>
                            {t("CLAIM_STAKING_REWARDS")}
                        </Modal.Header>
                        <Modal.Body className="rewards-modal-body">
                            <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmitInitialData}>
                                <div className="form-field">
                                    <p className="label">{t("TOTAL_AVAILABLE_BALANCE")}</p>
                                    <div className="available-tokens">
                                        <p className="tokens"
                                            title={props.totalRewards}>{props.totalRewards.toFixed(4)} XPRT</p>
                                        <p className="usd">= ${(props.totalRewards * props.tokenPrice).toFixed(4)}</p>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <p className="label">Validator</p>

                                    <Select value={validatorAddress} className="validators-list-selection"
                                        onChange={onChangeSelect} displayEmpty>
                                        <MenuItem value="" key={0}>
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            props.validatorsList.map((validator, index) => (
                                                <MenuItem
                                                    key={index + 1}
                                                    className=""
                                                    value={validator.operatorAddress}>
                                                    {validator.description.moniker}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </div>
                                <div className="form-field p-0">
                                    <p className="label"></p>
                                    <div className="available-tokens">
                                        <p className="tokens">Available Rewards {individualRewards} <span>XPRT</span>
                                        </p>
                                        <p className="usd">=${(individualRewards * props.tokenPrice).toFixed(4)}</p>
                                    </div>
                                </div>
                                {mode === "normal" ?
                                    <>
                                        <div className="memo-dropdown-section">
                                            <p onClick={handleMemoChange} className="memo-dropdown"><span
                                                className="text">{t("ADVANCED")} </span>
                                            {memoStatus ?
                                                <Icon
                                                    viewClass="arrow-right"
                                                    icon="up-arrow"/>
                                                :
                                                <Icon
                                                    viewClass="arrow-right"
                                                    icon="down-arrow"/>}
                                            </p>
                                            <OverlayTrigger trigger={['hover', 'focus']}
                                                placement="bottom"
                                                overlay={popoverMemo}>
                                                <button className="icon-button info" type="button"><Icon
                                                    viewClass="arrow-right"
                                                    icon="info"/></button>
                                            </OverlayTrigger>
                                        </div>
                                        {memoStatus ?
                                            <div className="form-field">
                                                <p className="label">{t("MEMO")}<OverlayTrigger
                                                    trigger={['hover', 'focus']}
                                                    placement="bottom"
                                                    overlay={popoverMemo}>
                                                    <button className="icon-button info" type="button"><Icon
                                                        viewClass="arrow-right"
                                                        icon="info"/></button>
                                                </OverlayTrigger></p>
                                                <Form.Control
                                                    type="text"
                                                    name="memo"
                                                    placeholder={t("ENTER_MEMO")}
                                                    maxLength={200}
                                                    required={false}
                                                />
                                            </div> : ""
                                        }
                                    </> : null
                                }
                                {
                                    errorMessage !== "" ?
                                        <p className="form-error">{errorMessage}</p>
                                        : null
                                }

                                <div className="buttons">
                                    {mode === "normal" ?
                                        <div className="button-section">
                                            <GasContainer checkAmountError={checkAmountError} activeFeeState={activeFeeState} onClick={handleFee} gas={gas}/>
                                            <div className="select-gas">
                                                <p onClick={handleGas}>{!showGasField ? "Set gas" : "Close"}</p>
                                            </div>
                                            {showGasField
                                                ?
                                                <div className="form-field">
                                                    <p className="label info">{t("GAS")}</p>
                                                    <div className="amount-field">
                                                        <Form.Control
                                                            type="number"
                                                            min={80000}
                                                            name="gas"
                                                            placeholder={t("ENTER_GAS")}
                                                            step="any"
                                                            defaultValue={gas}
                                                            onChange={handleGasChange}
                                                            required={false}
                                                        />
                                                        {
                                                            gasValidationError ?
                                                                <span className="amount-error">
                                                                    Enter Gas between 80000 to 2000000
                                                                </span> : ""
                                                        }
                                                    </div>
                                                </div>
                                                : ""
                                            }
                                            <button className="button button-primary"
                                                disabled={checkAmountError || disabled || individualRewards === 0 || gasValidationError}
                                            >Next</button>
                                        </div>
                                        :
                                        <button className="button button-primary"
                                            disabled={checkAmountError || disabled || individualRewards === 0}
                                        >Submit</button>
                                    }
                                </div>
                                <div className="buttons">
                                    <p className="button-link" type="button"
                                        onClick={() => handleRewards("setWithDraw")}>
                                        {t("SET_WITHDRAW_ADDRESS")}
                                        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                            overlay={popoverSetupAddress}>
                                            <button className="icon-button info" type="button"><Icon
                                                viewClass="arrow-right"
                                                icon="info"/></button>
                                        </OverlayTrigger>
                                    </p>
                                </div>
                            </Form>
                        </Modal.Body>
                    </>
                    : null
                }
                {seedModal ?
                    <>
                        <Modal.Header closeButton>
                            <div className="previous-section txn-header">
                                <button className="button" onClick={() => handlePrevious()}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                            </div>
                            <h3 className="heading">
                                {t("CLAIM_STAKING_REWARDS")}
                            </h3>
                        </Modal.Header>
                        <Modal.Body className="rewards-modal-body">
                            <Form onSubmit={handleSubmit}>
                                {
                                    importMnemonic ?
                                        <>
                                            <div className="form-field upload">
                                                <p className="label"> KeyStore file</p>
                                                <Form.File id="exampleFormControlFile1" name="uploadFile"
                                                    className="file-upload" accept=".json" required={true}/>
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
                                        </>
                                        :
                                        <>
                                            <div className="form-field">
                                                <p className="label">{t("KEY_STORE_PASSWORD")}</p>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder={t("ENTER_PASSWORD")}
                                                    required={true}
                                                />
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
                                    <button className="button button-primary">{t("CLAIM_REWARDS")}</button>
                                </div>
                            </Form>
                        </Modal.Body>

                    </>
                    : null
                }
                {
                    response !== '' && response.code === 0 ?
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
                                            target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                            Hash: {response.transactionHash}</a>
                                        :
                                        <a
                                            href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                            target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                            Hash: {response.transactionHash}</a>
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
                    response !== '' && response.code !== 0 ?
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
                                                target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                                Hash: {response.transactionHash}</a>
                                        </>
                                        :
                                        <>
                                            <p>{response.rawLog === "panic message redacted to hide potentially sensitive system info: panic" ? "You cannot send vesting amount" : response.rawLog}</p>
                                            <a
                                                href={`${EXPLORER_API}/transaction?txHash=${response.transactionHash}`}
                                                target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                                Hash: {response.transactionHash}</a>
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
            {withdraw ?
                <ModalSetWithdrawAddress setWithDraw={setWithDraw} handleClose={handleClose}
                    totalRewards={props.rewards} setShow={setShow} formName="setAddress"/>
                : null
            }
        </>
    );
};

const stateToProps = (state) => {
    return {
        list: state.rewards.list,
        rewards: state.rewards.rewards,
        balance: state.balance.amount,
        tokenPrice: state.tokenPrice.tokenPrice,
        transferableAmount: state.balance.transferableAmount,
        validatorsList:state.validators.validatorsListWithAddress
    };
};

const actionsToProps = {
    fetchValidatorsWithAddress,
};

export default connect(stateToProps, actionsToProps)(ModalWithdraw);
