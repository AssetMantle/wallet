import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ValidatorCommissionMsg} from "../../../../utils/protoMsgHelper";
import {
    setTxWithDrawTotalValidatorsCommission
} from "../../../../store/actions/transactions/withdrawTotalRewards";
import {Form} from "react-bootstrap";

const ValidatorCommission = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    let validatorCommissionInfo = useSelector((state) => state.rewards.validatorCommissionInfo);
    console.log(validatorCommissionInfo, "validatorCommissionInfo");
    const handleCommissionChange = (evt) => {
        let messages = [];
        if (evt.target.checked) {
            messages.push(ValidatorCommissionMsg(validatorCommissionInfo[1]));
        } else {
            messages = [];
        }
        dispatch(setTxWithDrawTotalValidatorsCommission({
            value:messages,
            error: new Error(''),
        }));
    };

    return (
        validatorCommissionInfo[2] ?
            <div className="form-field claim-check-box">
                <p className="label"></p>
                <div className="check-box-container">
                    <p className="label" title={(validatorCommissionInfo[0] * 1)}>{t("Claim Commission")}({(validatorCommissionInfo[0] * 1).toLocaleString()} XPRT)</p>
                    <Form.Control
                        type="checkbox"
                        name="claimCommission"
                        onChange={handleCommissionChange}
                        required={false}
                    />
                </div>
            </div>
            : ""
    );
};



export default ValidatorCommission;
