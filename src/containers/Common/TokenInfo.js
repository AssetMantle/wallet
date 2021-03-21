import React, {useState, useEffect} from "react";
import xprt from "../../assets/images/xprt.svg";
import ModalWithdraw from "../Wallet/ModalWithdraw";
import {getDelegationsUnbondUrl, getRewardsUrl, getDelegationsUrl, getBalanceUrl} from "../../constants/url";
import axios from "axios";
import Lodash from "lodash";
import helper from "../../utils/helper";

const TokenInfo = () => {
    const [unbondingDelegations, setUnbondingDelegations] = useState(0);
    const [totalRewards, setTotalRewards] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [totalDelegations, setTotalDelegations] = useState(0);
    useEffect(() => {
        const address = localStorage.getItem('address');
        console.log(address, "address loggedin")
        const unbondDelegationsUrl = getDelegationsUnbondUrl(address);
        const rewardsUrl = getRewardsUrl(address);
        const delegationsUrl = getDelegationsUrl(address);
        const balanceUrl = getBalanceUrl(address);
        const fetchInfo = async () => {
            const unbondingResponse = await axios.get(unbondDelegationsUrl);
            const rewardsResponse = await axios.get(rewardsUrl);
            const delegationResponse = await axios.get(delegationsUrl);
            const balanceResponse = await axios.get(balanceUrl);
            if(delegationResponse.data.delegation_responses.length){
                const totalDelegationsCount = Lodash.sumBy(delegationResponse.data.delegation_responses, (delegation) => {
                    return delegation.balance.amount*1;
                });
                setTotalDelegations(totalDelegationsCount/1000000);
                console.log(totalDelegationsCount/1000000, "totalDelgations");
            }

            if(unbondingResponse.data.unbonding_responses.length){
               const totalUnbond =  Lodash.sumBy(unbondingResponse.data.unbonding_responses, (item) => {
                    if(unbondingResponse.data.unbonding_responses[0].entries.length)
                    {
                        return unbondingResponse.data.unbonding_responses[0].entries[0].balance;
                    }
                });
                setUnbondingDelegations(totalUnbond);
            }

            if(rewardsResponse.data.total.length){
                const fixedRewardsResponse = rewardsResponse.data.total[0].amount / 1000000;
                setTotalRewards(fixedRewardsResponse.toFixed(4));
            }
            if(balanceResponse.data.balances.length){
                const totalBalance = Lodash.sumBy(balanceResponse.data.balances, (balance) => {
                    return balance.amount*1;
                });

                // let USD = totalBalance *rate;
                // USD = parseFloat(USD.toFixed(2)).toLocaleString();

                setTotalBalance(parseFloat((totalBalance / 1000000).toFixed(2)).toLocaleString())
            }

        };
        fetchInfo();
    }, []);
    const [rewards, setRewards] = useState(false);
    const handleRewards = () => {
        setRewards(true);
    };
    return (
        <div className="token-info-section">
            <div className="xprt-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <img src={xprt} alt="xprt"/>
                        <p className="total-supply">100,000,000.00</p>
                    </div>
                    <div className="line">
                        <p className="key">Balance XPRT</p>
                        <p className="value">{totalBalance}</p>
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
                        <p className="value">{totalDelegations} XPRT</p>
                    </div>
                </div>
            </div>
            <div className="rewards-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="key">Rewards (24h)</p>
                        <p className="value rewards" onClick={handleRewards}>{totalRewards} XPRT</p>
                    </div>
                    <div className="line">
                        <p className="key">Unbonding Token</p>
                        <p className="value">{unbondingDelegations} XPRT</p>
                    </div>
                </div>
            </div>
            {rewards ?
                <ModalWithdraw setRewards={setRewards} totalRewards={totalRewards}/>
                : null
            }

        </div>
    );
};
export default TokenInfo;