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
import transactions from "../../../utils/transactions";
import NumberView from "../../../components/NumberView";

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
        selectableRows: 'none',
        print: false,
        download: false,
        filter: false,
        search:false,
        viewColumns:false,
    };

    const tableData = props.list && props.list.length > 0
        ?
        props.list.map((stxn, index) => [
            <a key={index}
                href={`${EXPLORER_API}/transactions/${stxn.hash}`}
                target="_blank" className="tx-hash" rel="noopener noreferrer">
                {helper.stringTruncate(stxn.hash)}
            </a>,
            (stxn.typeUrl === "/ibc.applications.transfer.v1.MsgTransfer") ?
                <span key={index} className="type">{(stxn.typeUrl).substr((stxn.typeUrl).indexOf('/')+1)}</span>
                :
                <span key={index} className="type">{(stxn.typeUrl).substr((stxn.typeUrl).indexOf('v1beta1.') + 11)}</span>
            ,
            <div key={index} className="result">
                <span className="icon-box success">
                    <Icon
                        viewClass="arrow-right"
                        icon="success"/>
                </span>
            </div>,
            (stxn.body.amount !== undefined || stxn.body.token !== undefined ) ?
                stxn.body.amount !== undefined ?
                    (Array.isArray(stxn.body.amount) && stxn.body.amount.length) ?
                        stxn.body.amount[0].denom === 'uxprt' ?
                            <div className="amount" key={index}>
                                <NumberView data={helper.digitFormat(transactions.XprtConversion(stxn.body.amount[0].amount))}/>
                                <span className="string-truncate">XPRT</span>
                            </div>
                            :
                            <div className="amount" key={index}>
                                <NumberView data={helper.digitFormat(stxn.body.amount[0].amount)}/>
                                <span className="string-truncate">
                                    {
                                        stxn.body.amount[0].denom
                                    }
                                </span>
                            </div>
                        :

                        stxn.body.amount.denom === 'uxprt' ?
                            <div className="amount" key={index}>
                                <NumberView data={helper.digitFormat(transactions.XprtConversion(stxn.body.amount.amount))}/>
                                <span className="string-truncate">XPRT</span>
                            </div>
                            :
                            <div className="amount" key={index}>
                                <NumberView data={helper.digitFormat(stxn.body.amount.amount)}/>
                                <span className="string-truncate">
                                    {
                                        stxn.body.amount.denom
                                    }
                                </span>
                            </div>

                    :

                    (Array.isArray(stxn.body.token) && stxn.body.token.length) ?
                        stxn.body.token[0].denom === 'uxprt' ?
                            <div className="amount" key={index}>
                                <NumberView data={helper.digitFormat(transactions.XprtConversion(stxn.body.token[0].amount))}/>
                                <span className="string-truncate">XPRT</span>
                            </div>
                            :
                            <div className="amount" key={index}>
                                <NumberView data={helper.digitFormat(stxn.body.token[0].amount)}/>
                                <span className="string-truncate">
                                    {
                                        stxn.body.token[0].denom
                                    }
                                </span>
                            </div>
                        :

                        stxn.body.token.denom === 'uxprt' ?
                            <div className="amount" key={index}>
                                <NumberView data={helper.digitFormat(transactions.XprtConversion(stxn.body.token.amount))}/>
                                <span className="string-truncate">XPRT</span>
                            </div>
                            :
                            <div className="amount" key={index}>
                                <NumberView data={helper.digitFormat(stxn.body.token.amount)}/>
                                <span className="string-truncate">
                                    {
                                        stxn.body.token.denom
                                    }
                                </span>
                            </div>


                : '',
            (stxn.fee.amount !== undefined) ?
                (Array.isArray(stxn.fee.amount) && stxn.fee.amount.length) ?
                    stxn.fee.amount[0].denom === 'uxprt' ?
                        <div className="fee text-left" key={index}>
                            <NumberView data={helper.digitFormat(transactions.XprtConversion(stxn.fee.amount[0].amount))}/>
                            XPRT
                        </div>
                        :
                        <div className="fee text-left" key={index}>
                            <NumberView data={helper.digitFormat(transactions.XprtConversion(stxn.fee.amount[0].amount))}/>
                            {stxn.fee.amount[0].denom}
                        </div>
                    :
                    <div className="fee text-left" key={index}>
                        <NumberView data={helper.digitFormat(stxn.fee.amount.amount)}/>
                        {stxn.fee.amount.denom}
                    </div>
                : '',
            <a key={index} href={`${EXPLORER_API}/blocks/${stxn.height}`}
                target="_blank" className="height" rel="noopener noreferrer">{stxn.height}</a>,
            <span key={index} className="time">{moment.utc(stxn.timestamp).local().startOf('seconds').fromNow()}</span>,
        ])
        :
        [];
    if (props.inProgress && props.list.length) {
        return <Loader/>;
    }
    const handleNext = () => {
        if(!helper.checkLastPage(props.pageNumber[0], 5, props.pageNumber[1])) {
            props.fetchTransactions(address, 5, props.pageNumber[0] + 1);
        }
    };
    const handlePrevious = () => {
        if (props.pageNumber[0] >= 2) {
            props.fetchTransactions(address, 5, props.pageNumber[0] - 1);
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

                <div className="before buttons">
                    <IconButton aria-label="previous" onClick={handlePrevious}
                        disabled={props.pageNumber[0] >= 2 ? false : true}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <div className="before buttons">
                    <IconButton aria-label="next" className="next" onClick={handleNext} disabled={helper.checkLastPage(props.pageNumber[0], 5, props.pageNumber[1])?true : false}>
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
