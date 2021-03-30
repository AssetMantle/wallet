import React, {useState, useEffect} from "react";
import {connect} from 'react-redux';
import xprt from "../../assets/images/xprt.svg";
import ModalWithdraw from "../Wallet/ModalWithdraw";
import {fetchDelegationsCount} from "../../actions/delegations";
import {fetchBalance} from "../../actions/balance";
import {fetchRewards} from "../../actions/rewards";
import {fetchUnbondDelegations} from "../../actions/unbond";

const TokenInfo = (props) => {
    const [rewards, setRewards] = useState(false);
    useEffect(() => {
        let address = localStorage.getItem('address');
        props.fetchDelegationsCount(address);
        props.fetchBalance(address);
        props.fetchRewards(address);
        props.fetchUnbondDelegations(address);

    }, []);

    const handleRewards = () => {
        setRewards(true);
    };
    return (
        <div className="token-info-section">
            <div className="xprt-info info-box">
                <div className="inner-box">
                    {/*<div className="line">*/}
                    {/*    <img src={xprt} alt="xprt"/>*/}
                    {/*    <p className="total-supply">100,000,000.00</p>*/}
                    {/*</div>*/}
                    <div className="line">
                        <p className="key">Balance</p>
                        <p className="value">
                            {props.balance} XPRT</p>
                    </div>
                    <div className="line">
                        <p className="key">Balance in USD</p>
                        <p className="value">${(props.balance * 0.4).toFixed(6)}</p>
                    </div>
                </div>
            </div>
            <div className="price-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="key">Current Price</p>
                        <p className="value"> $0.40</p>
                    </div>
                    <div className="line">
                        <p className="key">Delegated Token</p>
                        <p className="value">{props.delegations} XPRT</p>
                    </div>
                </div>
            </div>
            <div className="rewards-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="key">Rewards</p>
                        <p className="value rewards" onClick={handleRewards}><span className="text">{props.rewards} XPRT</span> <span className="claim">Claim</span></p>
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
    };
};

const actionsToProps = {
    fetchDelegationsCount,
    fetchBalance,
    fetchRewards,
    fetchUnbondDelegations,
};

export default connect(stateToProps, actionsToProps)(TokenInfo);

