import React from 'react';
import Button from "./../../../../components/Button";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../../store/actions/transactions/keplr";
import {submitFormData} from "../../../../store/actions/transactions/withdrawTotalRewards";

const ButtonNext = () => {
    const dispatch = useDispatch();
    const onClick = () => {
        let messages = [];
        if (validatorsList.value.length) {
            messages = validatorsList.value;
        }
        if (validatorCommission.value.length) {
            messages.push(validatorCommission.value[0]);
        }
        dispatch(submitFormData(messages));
    };

    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    let validatorsList = useSelector((state) => state.mulitpleRewardsWithDraw.validatorsList);
    let validatorsRewards = useSelector((state) => state.mulitpleRewardsWithDraw.rewards);
    let validatorCommission = useSelector((state) => state.mulitpleRewardsWithDraw.commission);


    const onClickKeplr = () => {
        let messages = [];
        if (validatorsList.value.length) {
            messages = validatorsList.value;
        }
        if (validatorCommission.value.length) {
            messages.push(validatorCommission.value[0]);
        }
        dispatch(keplrSubmit(messages));
    };
    console.log(validatorCommission.value[0], "validatorCommission.value.length");
    const disable = (
        validatorsRewards.value === 0 && validatorCommission.value.length === 0
    );

    return (
        <div className="buttons">
            <div className="button-section">
                <Button
                    className="button button-primary"
                    type="button"
                    disable={disable}
                    value="Next"
                    onClick={loginInfo.loginMode === "keplr" ? onClickKeplr : onClick}
                />
            </div>
        </div>
    );
};



export default ButtonNext;
