import React, {useState, useEffect} from "react";
import {connect} from 'react-redux';
import xprt from "../../assets/images/xprt.svg";
import ModalWithdraw from "../Wallet/ModalWithdraw";
import {fetchDelegationsCount} from "../../actions/delegations";
import {fetchBalance} from "../../actions/balance";
import {fetchRewards} from "../../actions/rewards";
import {fetchUnbondDelegations} from "../../actions/unbond";
import {fetchTokenPrice} from "../../actions/tokenPrice";

const TokenInfo = (props) => {
    const [rewards, setRewards] = useState(false);
    useEffect(() => {
        let address = localStorage.getItem('address');
        props.fetchDelegationsCount(address);
        props.fetchBalance(address);
        props.fetchRewards(address);
        props.fetchUnbondDelegations(address);
        props.fetchTokenPrice();

    }, []);

    const handleRewards = () => {
        setRewards(true);
    };
    return (
        <div className="token-info-section">
            <div className="xprt-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="key">Balance</p>
                        <p className="value">
                            {props.balance} XPRT</p>
                    </div>
                    <div className="line">
                    <p className="key">Delegated</p>
                        <p className="value">{props.delegations} XPRT</p>
                     
                    </div>
                </div>
            </div>
            <div className="price-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="key">Current Price</p>
                        <p className="value"> ${props.tokenPrice}</p>
                    </div>
                    <div className="line">
                    <p className="key">Current Value</p>
                        <p className="value">${(props.balance * props.tokenPrice).toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <div className="rewards-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="key">Rewards</p>
                       
                    </div>
                    <div className="line">
                        <p className="value">{props.rewards} XPRT</p>
                        <p className="value rewards" onClick={handleRewards}><span className="claim">Claim</span></p>
                    </div>
                    <div className="line">
                        <p className="key">Unbonding Token</p>
                        <p className="value">{props.unbond} XPRT</p>
                    </div>
                </div>
            </div>
            {rewards ?
                <ModalWithdraw setRewards={setRewards} totalRewards={props.rewards}/>
                : null
            }

        </div>
    );
};

const stateToProps = (state) => {
    return {
        delegations: state.delegations.count,
        balance: state.balance.amount,
        rewards: state.rewards.rewards,
        unbond: state.unbond.unbond,
        tokenPrice:state.tokenPrice.tokenPrice
    };
};

const actionsToProps = {
    fetchDelegationsCount,
    fetchBalance,
    fetchRewards,
    fetchUnbondDelegations,
    fetchTokenPrice,
};

export default connect(stateToProps, actionsToProps)(TokenInfo);

