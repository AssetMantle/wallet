import React, {useState, useEffect} from "react";
import {connect} from 'react-redux';
import ModalWithdraw from "../Wallet/ModalWithdraw";
import {fetchDelegationsCount} from "../../actions/delegations";
import {fetchBalance, fetchTransferableVestingAmount} from "../../actions/balance";
import {fetchRewards, fetchTotalRewards} from "../../actions/rewards";
import {fetchUnbondDelegations} from "../../actions/unbond";
import {fetchTokenPrice} from "../../actions/tokenPrice";
import {useTranslation} from "react-i18next";
import ModalViewUnbondDetails from "./ModalViewUnbondDetails";
import ModalViewVestingDetails from "./ModalViewVestingDetails";
import ModalViewAmountDetails from "./ModalVIewAmountDetails";
import Icon from "../../components/Icon";
import {OverlayTrigger, Popover} from "react-bootstrap";
import transactions from "../../utils/transactions";

const TokenInfo = (props) => {
    const {t} = useTranslation();
    const [rewards, setRewards] = useState(false);
    let address = localStorage.getItem('address');

    useEffect(() => {
        props.fetchDelegationsCount(address);
        props.fetchBalance(address);
        props.fetchRewards(address);
        props.fetchTotalRewards(address);
        props.fetchUnbondDelegations(address);
        props.fetchTokenPrice();
        props.fetchTransferableVestingAmount(address);
        transactions.updateFee(address);
        setInterval(() => props.fetchTotalRewards(address), 10000);
    }, []);

    const handleRewards = (key) => {
        if (key === "rewards") {
            setRewards(true);
        }
    };
    const popoverVesting = (
        <Popover id="popover-vesting">
            <Popover.Content>
                {t("VESTING_NOTE")}
            </Popover.Content>
        </Popover>
    );
    const popoverDelegatable = (
        <Popover id="popover-vesting">
            <Popover.Content>
                {t("DELEGATABLE_NOTE")}
            </Popover.Content>
        </Popover>
    );
    const popoverTransferable = (
        <Popover id="popover-vesting">
            <Popover.Content>
                {t("TRANSFERABLE_NOTE")}
            </Popover.Content>
        </Popover>
    );

    const popoverTotal = (
        <Popover id="popover-total">
            <Popover.Content>
                {t("TOTAL_BALANCE_NOTE")}
            </Popover.Content>
        </Popover>
    );
    return (
        <div className="token-info-section">
            <p className="info-heading">Wallet Balances</p>
            <div className="token-info-section-body">

                <div className="xprt-info info-box">
                    <div className="inner-box">
                        <div className="line">
                            <p className="key">Total
                                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                    overlay={popoverTotal}>
                                    <button className="icon-button info" type="button"><Icon
                                        viewClass="arrow-right"
                                        icon="info"/></button>
                                </OverlayTrigger>
                            </p>
                            <p className="value"
                                title={props.delegations + props.balance + props.unbond}>
                                <span
                                    className="inner-grid-icon">
                                    {
                                        props.list.length > 1 ?
                                            <ModalViewAmountDetails/>
                                            : ""
                                    }
                                </span>
                                {(props.delegations + props.balance + props.unbond).toLocaleString()} XPRT
                            </p>
                        </div>
                        <div className="line">
                            <p className="key">{t("CURRENT_PRICE")}</p>
                            <p className="value"><span className="inner-grid-icon"/>
                                ${props.tokenPrice}
                            </p>
                        </div>
                        <div className="line">
                            <p className="key">{t("CURRENT_VALUE")}</p>
                            <p className="value"><span className="inner-grid-icon"/>
                                ${((props.delegations + props.balance + props.unbond) * props.tokenPrice).toLocaleString()}
                            </p>
                        </div>

                    </div>
                </div>
                <div className="price-info info-box">
                    <div className="inner-box">
                        <div className="line">
                            <p className="key">Vesting
                                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                    overlay={popoverVesting}>
                                    <button className="icon-button info" type="button"><Icon
                                        viewClass="arrow-right"
                                        icon="info"/></button>
                                </OverlayTrigger>
                            </p>
                            <p className="value" title={props.vestingAmount}>
                                <span className="inner-grid-icon">
                                    {
                                        props.vestingAmount > 0 ?
                                            <ModalViewVestingDetails/>
                                            : ""
                                    }
                                </span>
                                {props.vestingAmount.toLocaleString()} XPRT
                            </p>
                        </div>
                        <div className="line">
                            <p className="key">Transferable
                                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                    overlay={popoverTransferable}>
                                    <button className="icon-button info" type="button"><Icon
                                        viewClass="arrow-right"
                                        icon="info"/></button>
                                </OverlayTrigger>
                            </p>
                            <p className="value" title={props.transferableAmount}><span className="inner-grid-icon"/>
                                {props.transferableAmount.toLocaleString()} XPRT</p>
                        </div>
                        <div className="line">
                            <p className="key">Delegatable
                                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                                    overlay={popoverDelegatable}>
                                    <button className="icon-button info" type="button"><Icon
                                        viewClass="arrow-right"
                                        icon="info"/></button>
                                </OverlayTrigger>
                            </p>
                            <p className="value" title={props.balance}><span className="inner-grid-icon"/>
                                {props.balance.toLocaleString()} XPRT</p>
                        </div>

                    </div>
                </div>
                <div className="rewards-info info-box">
                    <div className="inner-box">
                        <div className="line">
                            <p className="key">Delegated</p>
                            <p className="value" title={props.delegations}>
                                <span className="inner-grid"/> {props.delegations.toLocaleString()} XPRT</p>
                        </div>
                        <div className="line">
                            <p className="key">{t("REWARDS")}</p>
                            <p className="value rewards"><span onClick={() => handleRewards("rewards")}
                                className="claim inner-grid">{t("CLAIM")}</span><span title={props.rewards}> {props.rewards.toLocaleString()}XPRT</span>
                            </p>
                        </div>
                        <div className="line">
                            <p className="key">{t("UNBONDING")}</p>
                            <p className="value"><span
                                className="inner-grid">
                                {
                                    props.unbond > 0 ?
                                        <ModalViewUnbondDetails/>
                                        : ""
                                }
                            </span>
                            <span title={props.unbond}>
                                {props.unbond.toLocaleString()} XPRT
                            </span>
                            </p>
                        </div>

                    </div>
                </div>
                {rewards ?
                    <ModalWithdraw setRewards={setRewards} totalRewards={props.rewards}/>
                    : null
                }

            </div>
        </div>

    );
};

const stateToProps = (state) => {
    return {
        delegations: state.delegations.count,
        balance: state.balance.amount,
        rewards: state.rewards.rewards,
        unbond: state.unbond.unbond,
        tokenPrice: state.tokenPrice.tokenPrice,
        list: state.balance.list,
        transferableAmount:state.balance.transferableAmount,
        vestingAmount:state.balance.vestingAmount
    };
};

const actionsToProps = {
    fetchDelegationsCount,
    fetchBalance,
    fetchRewards,
    fetchUnbondDelegations,
    fetchTokenPrice,
    fetchTransferableVestingAmount,
    fetchTotalRewards
};

export default connect(stateToProps, actionsToProps)(TokenInfo);

