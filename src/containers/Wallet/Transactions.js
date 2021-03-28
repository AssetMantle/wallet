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
        props.fetchTransactions(address, 30, 1);
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
        download:false
    };

    const tableData = props.list && props.list.length > 0
        ?
        props.list.map((stxn, index) => [
            helper.stringTruncate(stxn.txhash),
            (stxn.tx.value.msg[0].type).substr((stxn.tx.value.msg[0].type).indexOf('/') + 4),
            <div className="result">
                                    <span className="icon-box success">
                                        <Icon
                                            viewClass="arrow-right"
                                            icon="success"/>
                                    </span>
            </div>,
            (stxn.tx.value.msg[0].value.amount !== undefined && stxn.tx.value.msg[0].value.amount.length) ?
                <div>
                    {stxn.tx.value.msg[0].value.amount[0].amount}
                    {stxn.tx.value.msg[0].value.amount[0].denom}
                </div>
                :
                (stxn.tx.value.msg[0].value.amount !== undefined && stxn.tx.value.msg[0].value.amount) ?
                    <div>
                        {stxn.tx.value.msg[0].value.amount.amount}
                        {stxn.tx.value.msg[0].value.amount.denom}
                    </div>
                    :
                    (stxn.logs[0].events.find(event => event.type === 'transfer') !== undefined) ?
                        (stxn.logs[0].events.find(event => event.type === 'transfer').attributes.find(item => item.key === 'amount') !== undefined) ?
                            <div>
                                {stxn.logs[0].events.find(event => event.type === 'transfer').attributes.find(item => item.key === 'amount').value}
                            </div>
                            : ''
                        : '',
            (stxn.tx.value.fee.amount !== undefined && stxn.tx.value.fee.amount.length) ?
                <div>
                    {stxn.tx.value.fee.amount[0].amount}
                    {stxn.tx.value.fee.amount[0].denom}
                </div> : '',
            stxn.height,
            moment.utc(stxn.timestamp).local().startOf('seconds').fromNow(),
        ])
        :
        [];
    console.log(tableData, "red")
    if (props.inProgress && props.list.length) {
        return <Loader/>;
    }
    const handleNext = () =>{
        if(props.pageNumber[0] <  props.pageNumber[1]) {
            props.fetchTransactions(address, 12, props.pageNumber[0] + 1);
        }
    }
    const handlePrevious = () =>{
        if(props.pageNumber[0] > 1) {
            props.fetchTransactions(address, 12, props.pageNumber[0] - 1);
        }
    }
    return (
        <div className="txns-container">
            <DataTable
                columns={columns}
                data={tableData}
                name=""
                options={options}/>
            <div className="pagination-custom">
                <div className="before">
                    <IconButton aria-label="previous" onClick={handlePrevious} disabled={props.pageNumber[0] > 1 ? false : true}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <div>
                    <IconButton aria-label="next" className="next" onClick={handleNext} disabled={props.pageNumber[0] <  props.pageNumber[1] ? false : true}>
                        <ChevronRightIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};


const stateToProps = (state) => {
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
