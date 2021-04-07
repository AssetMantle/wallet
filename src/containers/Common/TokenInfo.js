import React, {useState, useEffect} from "react";
import {connect} from 'react-redux';
import ModalWithdraw from "../Wallet/ModalWithdraw";
import {fetchDelegationsCount} from "../../actions/delegations";
import {fetchBalance} from "../../actions/balance";
import {fetchRewards} from "../../actions/rewards";
import {fetchUnbondDelegations} from "../../actions/unbond";
import {fetchTokenPrice} from "../../actions/tokenPrice";
import ModalSetWithdrawAddress from "../Wallet/ModalSetWithdrawAddress";
import vestingAccount from "../../utils/vestingAmount";
import {useTranslation} from "react-i18next";


const TokenInfo = (props) => {
    const {t} = useTranslation();
    const [rewards, setRewards] = useState(false);
    const [withdraw, setWithDraw] = useState(false);
    const [vestingAmount, setVestingAmount] = useState(0);
    const [transferableAmount, setTransferableAmount] = useState(0);
    let address = localStorage.getItem('address');

    useEffect(() => {
        props.fetchDelegationsCount(address);
        props.fetchBalance(address);
        props.fetchRewards(address);
        props.fetchUnbondDelegations(address);
        props.fetchTokenPrice();
    }, []);

    vestingAccount.getTransferableVestingAmount(address, props.balance).then((vestingDetails) => {
        setVestingAmount(vestingDetails[0]);
        setTransferableAmount(vestingDetails[1]);
    });

    const handleRewards = (key) => {
        if (key === "rewards") {
            setRewards(true);
        } else if (key === "setWithDraw") {
            setWithDraw(true);
        }
    };
    return (
        <div className="token-info-section">
            <div className="xprt-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="key">{t("TOTAL_BALANCE")}</p>
                        <p className="value">{props.delegations + props.balance + props.unbond} XPRT</p>
                    </div>
                    <div className="line">
                        <p className="key">{t("AVAILABLE_DELEGATE_AMOUNT")}</p>
                        <p className="value">
                            {props.balance} XPRT</p>
                    </div>

                    <div className="line">
                        <p className="key">{t("DELEGATED")}</p>
                        <p className="value">{props.delegations} XPRT</p>
                    </div>
                </div>
            </div>
            <div className="price-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="key">{t("AMOUNT_UNDER_VESTING")}</p>
                        <p className="value"> {vestingAmount} XPRT</p>
                    </div>
                    <div className="line">
                        <p className="key">{t("TRANSFERABLE_AMOUNT")}</p>
                        <p className="value"> {transferableAmount} XPRT</p>
                    </div>
                    <div className="line">
                        <p className="key">{t("CURRENT_PRICE")}</p>
                        <p className="value"> ${props.tokenPrice}</p>
                    </div>
                    <div className="line">
                        <p className="key">{t("CURRENT_VALUE")}</p>
                        <p className="value">${(props.balance * props.tokenPrice).toFixed(2)}</p>
                    </div>

                </div>
            </div>
            <div className="rewards-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="key">{t("REWARDS")}</p>
                        <p className="value rewards" onClick={() => handleRewards("rewards")}><span
                            className="claim">Claim</span></p>
                    </div>
                    <div className="line">
                        <p className="value">{props.rewards} XPRT</p>
                        <p className="value rewards" onClick={() => handleRewards("setWithDraw")}
                           title="Claim your rewards in a separate account."><span className="claim">Set withdraw Address</span>
                        </p>
                    </div>
                    <div className="line">
                        <p className="key">{t("UNBONDING_TOKEN")}</p>
                        <p className="value">{props.unbond} XPRT</p>
                    </div>
                </div>
            </div>
            {rewards ?
                <ModalWithdraw setRewards={setRewards} totalRewards={props.rewards}/>
                : null
            }
            {withdraw ?
                <ModalSetWithdrawAddress setWithDraw={setWithDraw} totalRewards={props.rewards}/>
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
        tokenPrice: state.tokenPrice.tokenPrice
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

