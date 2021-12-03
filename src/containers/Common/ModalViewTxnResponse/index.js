import {Modal,} from 'react-bootstrap';
import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import success from "../../../assets/images/success.svg";
import failed from "../../../assets/images/inactive.svg";
import transactions from "../../../utils/transactions";
import {fetchDelegationsCount} from "../../../store/actions/delegations";
import {fetchBalance, fetchTransferableVestingAmount} from "../../../store/actions/balance";
import {fetchRewards, fetchTotalRewards} from "../../../store/actions/rewards";
import {fetchUnbondDelegations} from "../../../store/actions/unbond";
import {fetchTokenPrice} from "../../../store/actions/tokenPrice";
import {fetchReceiveTransactions, fetchTransactions} from "../../../store/actions/transactionQueries";
import {hideTxResultModal} from "../../../store/actions/transactions/common";

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;

const ModalViewTxnResponse = (props) => {
    const {t} = useTranslation();
    const mode = localStorage.getItem('loginMode');
    let address = localStorage.getItem('address');
    const dispatch = useDispatch();
    const show = useSelector((state) => state.common.modal);
    const response = useSelector(state => state.common.txResponse.value);
    const handleClose = () => {
        dispatch(hideTxResultModal());
    };

    useEffect(() => {
        if (response !== undefined) {
            dispatch(fetchDelegationsCount(address));
            dispatch(fetchBalance(address));
            dispatch(fetchRewards(address));
            dispatch(fetchTotalRewards(address));
            dispatch(fetchUnbondDelegations(address));
            dispatch(fetchTokenPrice());
            dispatch(fetchTransferableVestingAmount(address));
            dispatch(fetchTransactions(address, 5, 1));
            dispatch(fetchReceiveTransactions(address, 5, 1));
            transactions.updateFee(address);
        }
    }, [response]);

    console.log(response, "response");
    if(response === undefined){
        return null ;
    }

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" centered className="modal-custom ranh">
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
                                    <button className="button" onClick={handleClose}>{t("DONE")}</button>
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


export default ModalViewTxnResponse;
