import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import {useTranslation} from "react-i18next";
import transactions from "../../../utils/transactions";
import {WithdrawMsg} from "../../../utils/protoMsgHelper";
import {
    setTxWithDrawTotalRewardsAmount,
    setTxWithDrawTotalValidators
} from "../../../store/actions/transactions/withdrawTotalRewards";
import {ValidateMultipleValidatorsClaim} from "../../../utils/validations";
import NumberView from "../../../components/NumberView";
import {formatNumber} from "../../../utils/scripts";
import config from "../../../config";

const Validators = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    const validatorsList = useSelector((state) => state.rewards.validatorsRewardsList);
    let validatorsRewards = useSelector((state) => state.mulitpleRewardsWithDraw.rewards);
    const tokenPrice = useSelector((state) => state.tokenPrice.tokenPrice);

    const onChangeSelect = (evt) => {
        let totalValidatorsRewards = 0;
        let messages = [];
        evt.forEach(async (item) => {
            totalValidatorsRewards = totalValidatorsRewards + (transactions.XprtConversion(item.rewards).toFixed(6)*1);
            messages.push(WithdrawMsg(loginInfo.address, item.value));
        });
        dispatch(setTxWithDrawTotalValidators({
            value: messages,
            error: ValidateMultipleValidatorsClaim(evt),
        }));
        dispatch(setTxWithDrawTotalRewardsAmount({
            value: totalValidatorsRewards,
            error: ValidateMultipleValidatorsClaim(evt),
        }));
    };

    return (
        <>
            <div className="form-field rewards-validators-list">
                <p className="label">{t("SELECT_VALIDATOR")}</p>
                <ReactMultiSelectCheckboxes
                    options={validatorsList}
                    onChange={onChangeSelect}
                    placeholderButtonLabel="Select"
                />

            </div>
            <div className="form-field p-0">
                <p className="label"></p>
                <div className="available-tokens">
                    <p className="tokens">{t("CLAIMING_REWARDS")} <NumberView
                        value={formatNumber(validatorsRewards.value)}/><span>
                        {config.coinName}
                    </span></p>
                    <p className="usd">= $<NumberView
                        value={formatNumber(validatorsRewards.value * tokenPrice)}/></p>
                </div>
            </div>
        </>
    );
};


export default Validators;
