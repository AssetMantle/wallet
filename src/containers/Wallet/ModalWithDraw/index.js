import {Modal as ReactModal, OverlayTrigger, Popover} from 'react-bootstrap';
import React from 'react';
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {hideTxWithDrawTotalModal} from "../../../store/actions/transactions/withdrawTotalRewards";
import {setPreviousModalName, showTxWithDrawAddressModal} from "../../../store/actions/transactions/setWithdrawAddress";
import NumberView from "../../../components/NumberView";
import {formatNumber, stringTruncate} from "../../../utils/scripts";
import ValidatorCommission from "./ValidatorCommission";
import Validators from "./Validators";
import Memo from "./Memo";
import ButtonNext from "./ButtonNext";
import Icon from "../../../components/Icon";
import config from "../../../config";
import {LOGIN_INFO} from "../../../constants/localStorage";
import ReactGA from "react-ga";

const ModalWithDraw = () => {
    const {t} = useTranslation();
    const show = useSelector((state) => state.mulitpleRewardsWithDraw.modal);
    const rewards = useSelector((state) => state.rewards.rewards);
    const tokenPrice = useSelector((state) => state.tokenPrice.tokenPrice);
    let selectedValidators = useSelector((state) => state.mulitpleRewardsWithDraw.validatorsList);
    const loginInfo = JSON.parse(localStorage.getItem(LOGIN_INFO));
    const error = useSelector(state => state.common.error);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideTxWithDrawTotalModal());
    };

    const setWithdrawAddressHandler = () => {
        ReactGA.event({
            category: `Setup Rewards Withdrawal Address`,
            action: `Clicked on Setup Rewards Withdrawal Address`
        });
        dispatch(setPreviousModalName({
            value: 'withdrawTotal',
            error: {
                message: ''
            }
        }));
        dispatch(hideTxWithDrawTotalModal());
        dispatch(showTxWithDrawAddressModal());
    };

    const popoverSetupAddress = (
        <Popover id="popover-memo">
            <Popover.Content>
                {t("SETUP_ADDRESS_NOTE")}
            </Popover.Content>
        </Popover>
    );


    let ibcRewards = [];
    if(rewards && rewards[1]) {
        ibcRewards = (rewards[1].filter(item => item.denom !== config.coinDenom));
    }

    return (
        <ReactModal
            animation={false}
            backdrop="static"
            className="modal-custom claim-rewards-modal wallet-rewards-modal"
            centered={true}
            keyboard={false}
            show={show}
            onHide={handleClose}>
            <ReactModal.Header closeButton>
                <h3 className="heading">{t("CLAIM_STAKING_REWARDS")}</h3>
            </ReactModal.Header>

            <ReactModal.Body className="rewards-modal-body">
                <div className="form-field">
                    <p className="label">{t("TOTAL_AVAILABLE_BALANCE")}</p>
                    <div className="available-tokens">
                        <p className="tokens"
                            title={rewards.length ? (rewards[2] * tokenPrice) : 0}>
                            <NumberView value={formatNumber(rewards.length ? (rewards[2]) : 0)}/>
                            {config.coinName}
                        </p>
                        <p className="usd">= $<NumberView
                            value={formatNumber(rewards.length ? (rewards[2] * tokenPrice) : 0)}/></p>
                    </div>
                </div>
                {ibcRewards.length ?
                    <div className="form-field">
                        <p className="label">{t("IBC_REWARDS")}</p>
                        <div className="available-tokens">
                            <p className="tokens"
                                title={ibcRewards[0].amount}>
                                <NumberView value={formatNumber(ibcRewards[0].amount)}/>
                                <span title={ibcRewards[0].denom}>{stringTruncate(ibcRewards[0].denom)}</span>
                            </p>
                            <p className="usd">= $<NumberView
                                value={formatNumber(ibcRewards[0].amount * tokenPrice)}/></p>
                        </div>
                    </div>
                    : ""
                }
                <Validators/>
                <ValidatorCommission/>
                
                {loginInfo && loginInfo.loginMode !== config.keplrMode
                    ?
                    <Memo/>
                    : null
                }
                <div className="validator-limit-warning">
                    <p className="amount-warning">{selectedValidators.error.message !== '' ? "Warning:  Recommend 3 or fewer validators to avoid potential issues." : ""}</p>
                </div>
                {error.error.message !== '' ?
                    <p className="form-error">{error.error.message}</p> : null}
                <ButtonNext/>
                <div className="buttons">
                    <p className="button-link"
                        onClick={() => setWithdrawAddressHandler()}>
                        {t("SET_WITHDRAW_ADDRESS")}
                    </p>
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom"
                        overlay={popoverSetupAddress}>
                        <button className="icon-button info" type="button"><Icon
                            viewClass="arrow-right"
                            icon="info"/></button>
                    </OverlayTrigger>
                </div>
            </ReactModal.Body>
        </ReactModal>
    );
};

export default ModalWithDraw;
