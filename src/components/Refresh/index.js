import React, {useEffect} from "react";
import transactions from "../../utils/transactions";
import {fetchDelegationsCount} from "../../actions/delegations";
import {fetchBalance, fetchTransferableVestingAmount} from "../../actions/balance";
import {fetchRewards} from "../../actions/rewards";
import {fetchUnbondDelegations} from "../../actions/unbond";
import {fetchTokenPrice} from "../../actions/tokenPrice";
import {fetchReceiveTransactions, fetchTransactions} from "../../actions/transactions";
import {connect} from "react-redux";
import loaderImage from "../../assets/images/loader.svg";

const Refresh = (props) => {
    let address = localStorage.getItem('address');
    useEffect(() => {
        setTimeout(() => {
            props.setRefresh(false);
            if(props.name == "staking"){
                props.actionModal('');
            }
        }, 1000);
        props.fetchDelegationsCount(address);
        props.fetchBalance(address);
        props.fetchRewards(address);
        props.fetchUnbondDelegations(address);
        props.fetchTokenPrice();
        props.fetchTransactions(address, 5, 1);
        props.fetchReceiveTransactions(address, 5, 1);
        props.fetchTransferableVestingAmount(address);
        transactions.updateFee(address);
    }, []);


    return (
        <img src={loaderImage} alt="loader" className="loader"/>
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
    fetchTransferableVestingAmount
};

export default connect(null, actionsToProps)(Refresh);

