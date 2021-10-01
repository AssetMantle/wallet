import React, {useState} from "react";
import {connect} from 'react-redux';
import {fetchDelegationsCount} from "../actions/delegations";
import {fetchBalance, fetchTransferableVestingAmount} from "../actions/balance";
import {fetchRewards, fetchTotalRewards} from "../actions/rewards";
import {fetchUnbondDelegations} from "../actions/unbond";
import {fetchTokenPrice} from "../actions/tokenPrice";
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import {fetchTransactions, fetchReceiveTransactions} from "../actions/transactions";
import transactions from "../utils/transactions";

const InfoRefresh = (props) => {
    const [inProgress, setInProgress] = useState(false);
    let address = localStorage.getItem('address');
    const handleRefresh = () => {
        setInProgress(true);
        setTimeout(() => {
            setInProgress(false);
        }, 1000);
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
    };
    return (
        <IconButton
            className={inProgress ? 'refresh-button refresh-start' : 'refresh-button'}
            onClick={handleRefresh} title="Refresh">
            <RefreshIcon/>
        </IconButton>
    );
};

const stateToProps = (state) => {
    return {
        delegations: state.delegations.count,
        balance: state.balance.amount,
        rewards: state.rewards.rewards,
        unbond: state.unbond.unbond,
        tokenPrice: state.tokenPrice.tokenPrice
    };
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

export default connect(stateToProps, actionsToProps)(InfoRefresh);

