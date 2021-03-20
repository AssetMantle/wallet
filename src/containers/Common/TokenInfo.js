import React, {useState, useEffect} from "react";
import xprt from "../../assets/images/xprt.svg";
import ModalWithdraw from "../Wallet/ModalWithdraw";
import {getDelegationsUnbondUrl, getRewardsUrl, getDelegationsUrl, getBalanceUrl} from "../../constants/url";
import axios from "axios";

const TokenInfo = () => {
    const [unbondingDelegations, setUnbondingDelegations] = useState(0);
    const [totalRewards, setTotalRewards] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [totalDelegations, setTotalDelegations] = useState(0);
    useEffect(() => {
        const unbondDelegationsUrl = getDelegationsUnbondUrl('persistence1xfg28czjxsf75x9th4kejrjv3n6t7wfcu6gjpe');
        const rewardsUrl = getRewardsUrl('persistence1xfg28czjxsf75x9th4kejrjv3n6t7wfcu6gjpe');
        const delegationsUrl = getDelegationsUrl('persistence1095fgex3h37zl4yjptnsd7qfmspesvav7xhgwt');
        const balanceUrl = getBalanceUrl('persistence1wv9879c57ag7zthrtcvundrw3yvvt0a92wmmhq')
        const fetchInfo = async () => {
            const unbondingResponse = await axios.get(unbondDelegationsUrl);
            const rewardsResponse = await axios.get(rewardsUrl);
            const delegationResponse = await axios.get(delegationsUrl);
            const balanceResponse = await axios.get(balanceUrl);
            let delegationResponseList = delegationResponse.data.delegation_responses;
            let totalDelegationsCount = 0;
            delegationResponseList.forEach((delegation) => {
                totalDelegationsCount = totalDelegationsCount + (delegation.balance.amount*1);
            });
            console.log(totalDelegationsCount/1000000, "totalDelgations");
            setTotalDelegations(totalDelegationsCount/1000000);
            setUnbondingDelegations(unbondingResponse.data.unbonding_responses[0].entries[0].balance);
            const fixedRewardsResponse = rewardsResponse.data.total[0].amount / 1000000;
            setTotalRewards(fixedRewardsResponse.toFixed(4));
            setTotalBalance(balanceResponse.data.pagination.total)
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
                        <p className="value">${totalBalance}</p>
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