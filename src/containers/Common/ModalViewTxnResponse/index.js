import {
    Modal,
} from 'react-bootstrap';
import React,{useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {connect} from "react-redux";
import success from "../../../assets/images/success.svg";
import failed from "../../../assets/images/inactive.svg";
import transactions from "../../../utils/transactions";
import {fetchDelegationsCount} from "../../../actions/delegations";
import {fetchBalance, fetchTransferableVestingAmount} from "../../../actions/balance";
import {fetchRewards, fetchTotalRewards} from "../../../actions/rewards";
import {fetchUnbondDelegations} from "../../../actions/unbond";
import {fetchTokenPrice} from "../../../actions/tokenPrice";
import {fetchReceiveTransactions, fetchTransactions} from "../../../actions/transactions";

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;

const ModalViewTxnResponse = (props) => {
    const {t} = useTranslation();
    const mode = localStorage.getItem('loginMode');
    useEffect(()=>{
        if(props.response !== undefined) {
            let address = localStorage.getItem('address');
            props.fetchDelegationsCount(address);
            props.fetchBalance(address);
            props.fetchRewards(address);
            props.fetchTotalRewards(address);
            props.fetchUnbondDelegations(address);
            props.fetchTokenPrice();
            props.fetchTransactions(address, 5, 1);
            props.fetchReceiveTransactions(address, 5, 1);
            props.fetchTransferableVestingAmount(address);
            transactions.updateFee(address);
        }
    }, []);
    let response = props.response;
    return (
        <>
            {
                response !== '' && response.code === 0 ?
                    <>
                        <Modal.Header className="result-header success" closeButton>
                            {props.successMsg}
                        </Modal.Header>
                        <Modal.Body className="delegate-modal-body">
                            <div className="result-container">
                                <img src={success} alt="success-image"/>
                                {mode === "kepler" ?
                                    <a
                                        href={`${EXPLORER_API}/transactions/${response.transactionHash}`}
                                        target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                        Hash: {response.transactionHash}</a>
                                    :
                                    <a
                                        href={`${EXPLORER_API}/transactions/${response.transactionHash}`}
                                        target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                        Hash: {response.transactionHash}</a>
                                }
                                <div className="buttons">
                                    <button className="button" onClick={props.handleClose}>{t("DONE")}</button>
                                </div>
                            </div>
                        </Modal.Body>
                    </>
                    : null
            }{
                response !== '' && response.code !== 0 ?
                    <>
                        <Modal.Header className="result-header error" closeButton>
                            {props.failedMsg}
                        </Modal.Header>
                        <Modal.Body className="delegate-modal-body">
                            <div className="result-container">
                                <img src={failed} alt="success-image"/>
                                {mode === "kepler" ?
                                    <>
                                        <p>{response.rawLog}</p>
                                        <a
                                            href={`${EXPLORER_API}/transactions/${response.transactionHash}`}
                                            target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                        Hash: {response.transactionHash}</a>
                                    </>
                                    :
                                    <>
                                        <p>{response.rawLog === "panic message redacted to hide potentially sensitive system info: panic" ? "You cannot send vesting amount" : response.rawLog}</p>
                                        <a
                                            href={`${EXPLORER_API}/transactions/${response.transactionHash}`}
                                            target="_blank" className="tx-hash" rel="noopener noreferrer">Tx
                                        Hash: {response.transactionHash}</a>
                                    </>
                                }
                                <div className="buttons">
                                    <button className="button" onClick={props.handleClose}>{t("DONE")}</button>
                                </div>
                            </div>
                        </Modal.Body>
                    </>
                    : null
            }
        </>
    );
};

const actionsToProps = {
    fetchDelegationsCount,
    fetchBalance,
    fetchRewards,
    fetchUnbondDelegations,
    fetchTokenPrice,
    fetchTransactions,
    fetchReceiveTransactions,
    fetchTransferableVestingAmount,
    fetchTotalRewards
};

export default connect(null, actionsToProps)(ModalViewTxnResponse);
