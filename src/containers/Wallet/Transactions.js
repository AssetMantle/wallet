import React, {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import moment from 'moment';
import helper from "../../utils/helper";
import Icon from "../../components/Icon";
import Loader from "../../components/Loader";
import {fetchTransactions} from "../../actions/transactions";
import {connect} from "react-redux";
import DataTable from "../../components/DataTable";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
const Transactions = (props) => {
    const address = localStorage.getItem('address');
    useEffect(() => {
        props.fetchTransactions(address, 20, 1, "Initial");
    }, []);
    const columns = [{
        name: 'txHash',
        label: 'Tx Hash',
    }, {
        name: 'type',
        label: 'Type',
    }, {
        name: 'result',
        label: 'Result',
    }, {
        name: 'amount',
        label: 'Amount',

    }, {
        name: 'fee',
        label: 'Fee',
    }, {
        name: 'height',
        label: 'Height',

    }, {
        name: 'time',
        label: 'Time (UTC)',
    }];
    const options = {
        responsive: "standard",
        filters: false,
        pagination:false,
        selectableRows: false,
        print:false,
        download:false,
        filter: false,
    };

    const tableData = props.list && props.list.length > 0
        ?
        props.list.map((stxn, index) => [
            <a
                href={`https://dev.testnet-explorer.persistence.one/transaction?txHash=${stxn.txhash}`}
                target="_blank" className="tx-hash">
                {helper.stringTruncate(stxn.txhash)}
            </a>,
            <span className="type">{(stxn.tx.value.msg[0].type).substr((stxn.tx.value.msg[0].type).indexOf('/') + 4)}</span>,
            <div className="result">
                                    <span className="icon-box success">
                                        <Icon
                                            viewClass="arrow-right"
                                            icon="success"/>
                                    </span>
            </div>,
            (stxn.tx.value.msg[0].value.amount !== undefined && stxn.tx.value.msg[0].value.amount.length) ?
                <div className="amount">
                    {stxn.tx.value.msg[0].value.amount[0].amount}
                    {stxn.tx.value.msg[0].value.amount[0].denom}
                </div>
                :
                (stxn.tx.value.msg[0].value.amount !== undefined && stxn.tx.value.msg[0].value.amount) ?
                    <div className="amount">
                        {stxn.tx.value.msg[0].value.amount.amount}
                        {stxn.tx.value.msg[0].value.amount.denom}
                    </div>
                    :
                    (stxn.logs[0].events.find(event => event.type === 'transfer') !== undefined) ?
                        (stxn.logs[0].events.find(event => event.type === 'transfer').attributes.find(item => item.key === 'amount') !== undefined) ?
                            <div className="amount">
                                {stxn.logs[0].events.find(event => event.type === 'transfer').attributes.find(item => item.key === 'amount').value}
                            </div>
                            : ''
                        : '',
            (stxn.tx.value.fee.amount !== undefined && stxn.tx.value.fee.amount.length) ?
                <div className="fee">
                    {stxn.tx.value.fee.amount[0].amount}
                    {stxn.tx.value.fee.amount[0].denom}
                </div> : '',
            <a href={`https://dev.testnet-explorer.persistence.one/block?height=${stxn.height}`}
                target="_blank" className="height">{stxn.height}</a>,
            <span className="time">{moment.utc(stxn.timestamp).local().startOf('seconds').fromNow()}</span>,
        ])
        :
        [];
    if (props.inProgress && props.list.length) {
        return <Loader/>;
    }
    const handleNext = () =>{
        console.log(props.pageNumber[0], props.pageNumber[1], "previos")
        if(props.pageNumber[0] <  props.pageNumber[1]) {
            props.fetchTransactions(address, 20, props.pageNumber[0] + 1);
        }
        else if(props.pageNumber[0] > 1 && props.pageNumber[0] === props.pageNumber[1]){
            props.fetchTransactions(address, 20, props.pageNumber[0] - 1, "Initial");
        }
    };
    const handlePrevious = () =>{

        if(props.pageNumber[0] > 1) {
            props.fetchTransactions(address, 20, props.pageNumber[0] - 1);
        }
    };
    return (
        <div className="txns-container">
            <DataTable
                columns={columns}
                data={tableData}
                name=""
                options={options}/>
            <div className="pagination-custom">

                <div className="before">
                    <IconButton aria-label="previous" onClick={handleNext} disabled={props.pageNumber[0] === props.pageNumber[1] ? true : false}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <div>
                    <IconButton aria-label="next" className="next" onClick={handlePrevious} disabled={props.pageNumber[0] > 1 ? false : true}>
                        <ChevronRightIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};


const stateToProps = (state) => {
    console.log(state.transactions.pageNumber)
    return {
        list: state.transactions.list,
        inProgress: state.transactions.inProgress,
        pageNumber:state.transactions.pageNumber
    };
};

const actionsToProps = {
    fetchTransactions,
};

export default connect(stateToProps, actionsToProps)(Transactions);
