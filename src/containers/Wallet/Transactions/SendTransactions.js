import React, {useEffect} from "react";
import moment from 'moment';
import helper from "../../../utils/helper";
import Icon from "../../../components/Icon";
import Loader from "../../../components/Loader";
import {fetchTransactions} from "../../../actions/transactions";
import {connect} from "react-redux";
import DataTable from "../../../components/DataTable";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;
const SendTransactions = (props) => {
    const address = localStorage.getItem('address');
    useEffect(() => {
        props.fetchTransactions(address, 5, 1);
    }, []);
    const columns = [{
        name: 'txHash',
        label: 'Tx Hash',
        options: {sort: false}
    }, {
        name: 'type',
        label: 'Type',
        options: {sort: false}
    }, {
        name: 'result',
        label: 'Result',
        options: {sort: false}
    }, {
        name: 'amount',
        label: 'Amount',
        options: {sort: false}

    }, {
        name: 'fee',
        label: 'Fee',
        options: {sort: false}
    }, {
        name: 'height',
        label: 'Height',
        options: {sort: false}

    }, {
        name: 'time',
        label: 'Time (UTC)',
        options: {sort: false}
    }];
    const options = {
        responsive: "standard",
        filters: false,
        pagination: false,
        selectableRows: false,
        print: false,
        download: false,
        filter: false,
        search:false
    };

    const tableData = props.list && props.list.length > 0
        ?
        props.list.map((stxn, index) => [
            <a
                href={`${EXPLORER_API}/transaction?txHash=${stxn.txhash}`}
                target="_blank" className="tx-hash">
                {helper.stringTruncate(stxn.txhash)}
            </a>,
            <span
                className="type">{(stxn.tx.body.messages[0]["@type"]).substr((stxn.tx.body.messages[0]["@type"]).indexOf('v1beta1.') + 11)}</span>,
            <div className="result">
                                    <span className="icon-box success">
                                        <Icon
                                            viewClass="arrow-right"
                                            icon="success"/>
                                    </span>
            </div>,
            (stxn.tx.body.messages[0].amount !== undefined && stxn.tx.body.messages[0].amount.length) ?
                <div className="amount">
                    {stxn.tx.body.messages[0].amount[0].amount}
                    {stxn.tx.body.messages[0].amount[0].denom}
                </div>
                :
                (stxn.tx.body.messages[0].amount !== undefined && stxn.tx.body.messages[0].amount) ?
                    <div className="amount">
                        {stxn.tx.body.messages[0].amount.amount}
                        {stxn.tx.body.messages[0].amount.denom}
                    </div>
                    :
                    (stxn.logs[0].events.find(event => event.type === 'transfer') !== undefined) ?
                        (stxn.logs[0].events.find(event => event.type === 'transfer').attributes.find(item => item.key === 'amount') !== undefined) ?
                            <div className="amount">
                                {stxn.logs[0].events.find(event => event.type === 'transfer').attributes.find(item => item.key === 'amount').value}
                            </div>
                            : ''
                        : '',
            (stxn.tx.auth_info.fee.amount !== undefined && stxn.tx.auth_info.fee.amount.length) ?
                <div className="fee">
                    {stxn.tx.auth_info.fee.amount[0].amount}
                    {stxn.tx.auth_info.fee.amount[0].denom}
                </div> : '',
            <a href={`${EXPLORER_API}/block?height=${stxn.height}`}
               target="_blank" className="height">{stxn.height}</a>,
            <span className="time">{moment.utc(stxn.timestamp).local().startOf('seconds').fromNow()}</span>,
        ])
        :
        [];
    if (props.inProgress && props.list.length) {
        return <Loader/>;
    }
    const handleNext = () => {
        if(!helper.CheckLastPage(props.pageNumber[0], 5, props.pageNumber[1])) {
            props.fetchTransactions(address, 5, props.pageNumber[0] + 1);
        }
    };
    const handlePrevious = () => {
        if (props.pageNumber[0] > 1) {
            props.fetchTransactions(address, 5, props.pageNumber[0] - 1);
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

                <div className="before buttons">
                    <IconButton aria-label="previous" onClick={handlePrevious}
                                disabled={props.pageNumber[0] > 1 ? false : true}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <div className="before buttons">
                    <IconButton aria-label="next" className="next" onClick={handleNext} disabled={helper.CheckLastPage(props.pageNumber[0], 5, props.pageNumber[1])?true : false}>
                        <ChevronRightIcon/>
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
        pageNumber: state.transactions.pageNumber
    };
};

const actionsToProps = {
    fetchTransactions,
};

export default connect(stateToProps, actionsToProps)(SendTransactions);
