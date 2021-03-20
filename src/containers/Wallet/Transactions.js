import React, {useEffect, useState} from "react";
import {Table, Modal} from "react-bootstrap";
import {getDelegationsUrl, getSendTransactionsUrl, getValidatorUrl} from "../../constants/url";
import moment from 'moment';
import axios from "axios";
import helper from "../../utils/helper";
import Icon from "../../components/Icon";
const Transactions = () => {
    const [sendTransactionsList, setSendTransactionsList] = useState([]);
    useEffect(() => {
        const fetchValidators = async () => {
            const sendTxnsUrl = getSendTransactionsUrl('persistence1xepyv8lf99pa4x0w2ptr3vx3rr7wfs6men2xhr');
            const sendTxnsResponse = await axios.get(sendTxnsUrl);
            console.log(sendTxnsResponse, "red")
            let sendTxnsResponseList = sendTxnsResponse.data.txs;
            setSendTransactionsList(sendTxnsResponseList);
            let sendTransactions = [];
            // for (const item of delegationResponseList) {
            //     const validatorUrl = getValidatorUrl(item.delegation.validator_address);
            //     const validatorResponse = await axios.get(validatorUrl);
            //     validators.push(validatorResponse.data.validator);
            // }
            // setSendTransactionsList(validators);
        };
        fetchValidators();
    }, []);
    return (
        <div className="txns-container">
            <Table borderless hover responsive>
                <thead>
                <tr>
                    <th>Tx Hash</th>
                    <th>Type</th>
                    <th>Result</th>
                    <th>Amount</th>
                    <th>Fee</th>
                    <th>Height</th>
                    <th>Time</th>
                </tr>
                </thead>
                <tbody>
                {
                    sendTransactionsList.map((stxn, index) => {
                        let hash  = helper.stringTruncate(stxn.txhash);
                        let amountDenom='';
                        let amount= 0 ;
                        let feeDenom='';
                        let fee=0;

                        if(stxn.tx.value.msg[0].value.amount !== undefined){
                            amountDenom = stxn.tx.value.msg[0].value.amount[0].denom;
                            amount = stxn.tx.value.msg[0].value.amount[0].value;
                        }

                        if(stxn.tx.value.fee.amount !== undefined && stxn.tx.value.fee.amount.length){
                            feeDenom =stxn.tx.value.fee.amount[0].denom;
                            fee =stxn.tx.value.fee.amount[0].amount;
                        }
                        let height = stxn.height;
                        let timestamp = stxn.timestamp;

                        let ago = moment.utc(timestamp).local().startOf('seconds').fromNow()
                        return (
                            <tr>
                                <td className="tx-hash"><a href={`https://explorer.persistence.one/transactions/${stxn.txhash}`} target="_blank">
                                    {hash}
                                </a></td>
                                <td className="type">send</td>
                                <td className="result">
                                    <span className="icon-box success">
                                        <Icon
                                            viewClass="arrow-right"
                                            icon="success"/>
                                    </span>
                                </td>
                                <td className="amount">{amount} {amountDenom}</td>
                                <td className="fee">{fee} {feeDenom}</td>
                                <td className="height">{height}</td>
                                <td className="time">{ago}</td>
                            </tr>
                        )
                    })
                }


                </tbody>
            </Table>
        </div>
    );
};
export default Transactions