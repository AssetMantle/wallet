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
import ModalViewUnbondDetails from "./ModalViewUnbondDetails";
import ModalViewVestingDetails from "./ModalViewVestingDetails";

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
                        <p className="info-heading">Wallet Balances</p>
                        <p className="value"></p>
                    </div>
                    <div className="line">
                        <p className="key">Total</p>
                        <p className="value"
                           title={props.delegations + props.balance + props.unbond}>{(props.delegations + props.balance + props.unbond).toFixed(3)} XPRT</p>
                    </div>
                    <div className="line">
                        <p className="key">{t("CURRENT_PRICE")}</p>
                        <p className="value"> ${props.tokenPrice}</p>
                    </div>
                    <div className="line">
                        <p className="key">{t("CURRENT_VALUE")}</p>
                        <p className="value">${((props.delegations + props.balance + props.unbond) * props.tokenPrice).toFixed(3)}</p>
                    </div>

                </div>
            </div>
            <div className="price-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="info-heading not-show">Wallet Balances</p>
                        <p className="value"></p>
                    </div>
                    <div className="line">
                        <p className="key">Vesting</p>
                        <p className="value" title={vestingAmount}> {vestingAmount.toFixed(3)} XPRT
                            {
                                vestingAmount > 0 ?
                                    <ModalViewVestingDetails/>
                                    : ""
                            }
                        </p>
                    </div>
                    <div className="line">
                        <p className="key">Transferable</p>
                        <p className="value" title={transferableAmount}> {transferableAmount.toFixed(3)} XPRT</p>
                    </div>
                    <div className="line">
                        <p className="key">Delegatable</p>
                        <p className="value">
                            {props.balance.toFixed(3)} XPRT</p>
                    </div>

                </div>
            </div>
            <div className="rewards-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="info-heading not-show">Wallet Balances</p>
                        <p className="value"></p>
                    </div>
                    <div className="line">
                        <p className="key">Delegated</p>
                        <p className="value" title={props.delegations}>{props.delegations.toFixed(3)} XPRT</p>
                    </div>
                    <div className="line">
                        <p className="key">{t("REWARDS")}</p>
                        <p className="value rewards" onClick={() => handleRewards("rewards")}>{props.rewards} XPRT<span
                            className="claim">{t("CLAIM")}</span></p>
                    </div>
                    <div className="line">
                        <p className="key">{t("UNBONDING_TOKEN")}</p>
                        <p className="value" title={props.unbond}>{props.unbond.toFixed(3)} XPRT
                            {
                                props.unbond > 0 ?
                                    <ModalViewUnbondDetails/>
                                    : ""
                            }
                        </p>
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

