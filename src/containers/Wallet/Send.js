import React, { useState} from "react";
import {
    Modal,
    Form,
    OverlayTrigger,
    Popover,
} from "react-bootstrap";
import Icon from "../../components/Icon";
import transactions from "../../utils/transactions";
import helper from "../../utils/helper";
import aminoMsgHelper from "../../utils/aminoMsgHelper";
import Loader from "../../components/Loader";
import {SendMsg} from "../../utils/protoMsgHelper";
import {connect} from "react-redux";
import config from "../../config";
import {useTranslation} from "react-i18next";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import ModalGasAlert from "../Gas/ModalGasAlert";
import ModalViewTxnResponse from "../Common/ModalViewTxnResponse";

const Send = (props) => {
    const {t} = useTranslation();
    const [enteredAmount, setEnteredAmount] = useState('');
    const [amountField, setAmountField] = useState();
    const [txResponse, setTxResponse] = useState('');
    const [show, setShow] = useState(true);
    const [memoStatus, setMemoStatus] = useState(false);
    const [keplerError, setKeplerError] = useState("");
    const [loader, setLoader] = useState(false);
    const [checkAmountError, setCheckAmountError] = useState(false);
    const [token, setToken] = useState("uxprt");
    const [tokenDenom, setTokenDenom] = useState("uxprt");
    const [transferableAmount, setTransferableAmount] = useState(props.transferableAmount);
    const [tokenItem, setTokenItem] = useState({});
    const [feeModal, setFeeModal] = useState(false);
    let mode = localStorage.getItem('loginMode');
    let loginAddress = localStorage.getItem('address');
    const [formData, setFormData] = useState({});

    const handleClose = () => {
        setShow(true);
        setTxResponse('');
        setFeeModal(false);
    };

    const handleAmountChange = (evt) => {
        let rex = /^\d*\.?\d{0,2}$/;
        if (rex.test(evt.target.value)) {
            if(tokenDenom === "uxprt") {
                if (props.transferableAmount < (evt.target.value * 1)) {
                    setCheckAmountError(true);
                } else {
                    setCheckAmountError(false);
                }
            }else {
                if (transferableAmount < (evt.target.value * 1)) {
                    setCheckAmountError(true);
                } else {
                    setCheckAmountError(false);
                }
            }
            setEnteredAmount(evt.target.value);
            setAmountField(evt.target.value * 1);
        } else {
            return false;
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (helper.validateAddress(event.target.address.value)) {
            if (mode !== "kepler") {
                let memo = "";
                if (memoStatus) {
                    memo = event.target.memo.value;
                }
                let memoCheck = helper.mnemonicValidation(memo, loginAddress);
                if (memoCheck) {
                    setKeplerError(t("MEMO_MNEMONIC_CHECK_ERROR"));
                } else {
                    const data = {
                        amount : amountField,
                        denom : tokenDenom,
                        memo : memo,
                        toAddress : event.target.address.value,
                        modalHeader: "Send Token",
                        formName: "send",
                        successMsg : t("SUCCESSFUL_SEND"),
                        failedMsg : t("FAILED_SEND")
                    };
                    setShow(true);
                    setFormData(data);
                    setFeeModal(true);
                    setKeplerError('');
                }
            } else {
                setKeplerError('');
            }
        } else {
            setKeplerError("Invalid Recipient Address");
        }
        event.target.reset();
    };

    const handleSubmitKepler = event => {
        setLoader(true);
        event.preventDefault();

        if (helper.validateAddress(event.target.address.value)) {
            const response = transactions.TransactionWithKeplr([SendMsg(loginAddress, event.target.address.value, (amountField * config.xprtValue).toFixed(0), tokenDenom)], aminoMsgHelper.fee(0, 250000));
            response.then(result => {
                if (result.code !== undefined) {
                    helper.accountChangeCheck(result.rawLog);
                }
                setTxResponse(result);
                setLoader(false);
            }).catch(err => {
                setLoader(false);
                setKeplerError(err.message);
                helper.accountChangeCheck(err.message);
            });
        }
        else {
            setLoader(false);
            setKeplerError("Invalid Recipient Address");
        }
        event.target.reset();
    };

    if (loader) {
        return <Loader/>;
    }

    const handleMemoChange = () => {
        setMemoStatus(!memoStatus);
    };

    const onChangeSelect = (evt) => {
        setToken(evt.target.value);
        if(evt.target.value === 'uxprt'){
            setTokenDenom(evt.target.value);
            setTransferableAmount(props.transferableAmount);
        }
        else {
            props.tokenList.forEach((item) => {
                if(evt.target.value === item.denomTrace){
                    setTokenDenom(item.denom.baseDenom);
                    setTransferableAmount(transactions.XprtConversion(item.amount * 1));
                    setTokenItem(item);
                }
            });
        }
    };

    const selectTotalBalanceHandler = (value) =>{
        setEnteredAmount(parseFloat(( parseInt( (value * 100).toString() ) / 100 ).toFixed(2)).toString());
        setAmountField(parseFloat(( parseInt( (value * 100).toString() ) / 100 ).toFixed(2)));
    };

    const popoverMemo = (
        <Popover id="popover-memo">
            <Popover.Content>
                {t("MEMO_NOTE")}
            </Popover.Content>
        </Popover>
    );

    const popover = (
        <Popover id="popover">
            <Popover.Content>
                Recipient’s address starts with persistence; for example:
                persistence14zmyw2q8keywcwhpttfr0d4xpggylsrmd4caf4
            </Popover.Content>
        </Popover>
    );

    return (
        <div className="send-container">
            <div className="form-section">
                <Form onSubmit={mode === "kepler" ? handleSubmitKepler : handleSubmit}>
                    <div className="form-field">
                        <p className="label info">{t("RECIPIENT_ADDRESS")}
                            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
                                <button className="icon-button info" type="button"><Icon
                                    viewClass="arrow-right"
                                    icon="info"/></button>
                            </OverlayTrigger></p>
                        <Form.Control
                            type="text"
                            name="address"
                            onKeyPress={helper.inputSpaceValidation}
                            placeholder="Enter Recipient's address "
                            required={true}
                        />
                    </div>
                    <div className="form-field">
                        <p className="label">{t("TOKEN")} </p>
                        <Select value={token} className="validators-list-selection"
                            onChange={onChangeSelect} displayEmpty>
                            {
                                <MenuItem
                                    className=""
                                    value="uxprt">
                                        XPRT
                                </MenuItem>
                            }
                        </Select>
                    </div>

                    <div className="form-field p-0">
                        <p className="label">{t("AMOUNT")}</p>
                        <div className="amount-field">
                            <Form.Control
                                type="number"
                                min={0}
                                name="amount"
                                placeholder={t("SEND_AMOUNT")}
                                step="any"
                                onKeyPress={helper.inputAmountValidation}
                                className={amountField > props.transferableAmount ? "error-amount-field" : ""}
                                value={enteredAmount}
                                onChange={handleAmountChange}
                                required={true}
                            />
                            {
                                tokenDenom === "uxprt" ?
                                    <span className={props.transferableAmount === 0 ? "empty info-data" : "info-data info-link"} onClick={()=>selectTotalBalanceHandler(props.transferableAmount)}><span
                                        className="title">Transferable Balance:</span> <span
                                        className="value"
                                        title={props.transferableAmount}>{props.transferableAmount.toLocaleString()} XPRT</span> </span>
                                    :
                                    <span title={tokenItem.denomTrace} className={transferableAmount === 0 ? "empty info-data" : "info-data"}>
                                        <span
                                            className="title">Transferable Balance:</span> <span
                                            className="value">{transferableAmount.toLocaleString()}  ATOM ( IBC Trace path - {tokenItem.denom.path} , denom: {tokenItem.denom.baseDenom}  )</span> </span>
                            }
                        </div>
                    </div>
                    <div className="form-field p-0">
                        <p className="label"></p>
                        <div className="amount-field">
                            <p className={checkAmountError ? "show amount-error text-left" : "hide amount-error text-left"}>{t("AMOUNT_ERROR_MESSAGE")}</p>
                        </div>
                    </div>
                    {mode !== "kepler" ?
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
                                    <p className="label info">{t("MEMO")}
                                        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
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
                                </div>
                                : ""}

                        </>
                        : null
                    }

                    {keplerError !== '' ?
                        <p className="form-error">{keplerError}</p> : null}
                    <div className="buttons">
                        {mode !== "kepler"  ?
                            <div className="button-section">
                                <button className="button button-primary"
                                    disabled={checkAmountError || amountField === 0 || props.transferableAmount === 0}
                                >Next
                                </button>
                            </div>
                            :
                            <button className="button button-primary"
                                disabled={checkAmountError || amountField === 0 || props.transferableAmount === 0}
                            >Submit</button>
                        }
                    </div>
                </Form>
            </div>

            {txResponse !== '' ?
                <Modal show={show} onHide={handleClose} backdrop="static" centered className="modal-custom">
                    <ModalViewTxnResponse
                        response = {txResponse}
                        successMsg = {t("SUCCESSFUL_SEND")}
                        failedMsg = {t("FAILED_SEND")}
                        handleClose={handleClose}
                    />
                </Modal>
                : null}

            {feeModal ?
                <Modal show={show} onHide={handleClose} backdrop="static" centered className="modal-custom">
                    <ModalGasAlert
                        amountField={amountField}
                        setShow={setShow}
                        setFeeModal={setFeeModal}
                        formData={formData}
                        handleClose={handleClose}
                    />
                </Modal>
                : null
            }
        </div>
    );
};


const stateToProps = (state) => {
    return {
        balance: state.balance.amount,
        tokenList: state.balance.tokenList,
        transferableAmount: state.balance.transferableAmount,
    };
};

export default connect(stateToProps)(Send);
