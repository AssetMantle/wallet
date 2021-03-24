import React, {useState, useEffect} from "react";
import xprt from "../../assets/images/xprt.svg";
import ModalWithdraw from "../Wallet/ModalWithdraw";
import {getDelegationsUnbondUrl, getRewardsUrl, getDelegationsUrl, getBalanceUrl} from "../../constants/url";
import axios from "axios";
import Lodash from "lodash";

const TokenInfo = () => {
    const [unbondingDelegations, setUnbondingDelegations] = useState(0);
    const [totalRewards, setTotalRewards] = useState('0');
    const [totalBalance, setTotalBalance] = useState('0');
    const [totalDelegations, setTotalDelegations] = useState('0' );
    const [rewards, setRewards] = useState(false);
    useEffect(() => {
        const address = localStorage.getItem('address');
        const fetchInfo = async () => {
            const unbondDelegationsUrl = getDelegationsUnbondUrl(address);
            const rewardsUrl = getRewardsUrl(address);
            const delegationsUrl = getDelegationsUrl(address);
            const balanceUrl = getBalanceUrl(address);
            await axios.get(unbondDelegationsUrl).then(response => {
                if (response.data.unbonding_responses.length) {
                    const totalUnbond = Lodash.sumBy(response.data.unbonding_responses, (item) => {
                        if (response.data.unbonding_responses[0].entries.length) {
                            return response.data.unbonding_responses[0].entries[0].balance;
                        }
                    });
                    setUnbondingDelegations(totalUnbond);
                }
            }).catch(error => {
                console.log(error.response, "error unbondDelegations")
            });

            await axios.get(delegationsUrl).then(response => {
                console.log(response, "response")
                if (response.data.delegation_responses.length) {
                    const totalDelegationsCount = Lodash.sumBy(response.data.delegation_responses, (delegation) => {
                        return delegation.balance.amount * 1;
                    });
                    setTotalDelegations(totalDelegationsCount / 1000000);
                    console.log(totalDelegationsCount / 1000000, "totalDelgations");
                }
            }).catch(error => {
                console.log(error.response, "error delegationsUrl")
            });

            await axios.get(rewardsUrl).then(response => {
                if (response.data.total.length) {
                    const fixedRewardsResponse = response.data.total[0].amount / 1000000;
                    setTotalRewards(fixedRewardsResponse.toFixed(4));
                }
            }).catch(error => {
                console.log(error, "error rewardsResponse")
            });

            await axios.get(balanceUrl).then(response => {
                if (response.data.balances.length) {
                    const totalBalance = Lodash.sumBy(response.data.balances, (balance) => {
                        return balance.amount * 1;
                    });

                    // let USD = totalBalance *rate;
                    // USD = parseFloat(USD.toFixed(2)).toLocaleString();

                    setTotalBalance(parseFloat((totalBalance / 1000000).toFixed(2)).toLocaleString());
                }
            }).catch(error => {
                console.log(error, "error balance")
            });

        };
        fetchInfo();
    }, []);

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
                        <p className="value">
                            { totalBalance}</p>
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
                        <p className="value rewards" onClick={handleRewards}>{totalRewards} XPRT <span>Claim</span></p>
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