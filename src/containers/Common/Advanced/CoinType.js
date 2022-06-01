import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ValidateCoinType} from "../../../utils/validations";
import {useTranslation} from "react-i18next";
import {setCoinType} from "../../../store/actions/transactions/advanced";
import InputText from "../../../components/InputText";

const CoinType = () => {
    const {t} = useTranslation();
    const coinType = useSelector((state) => state.advanced.coinType);
    const dispatch = useDispatch();

    const onChange = (evt) => {
        dispatch(setCoinType({
            value: (evt.target.value),
            error: ValidateCoinType(evt.target.value)
        }));
    };


    return (
        <div className="form-field">
            <p className="label">{t("COIN_TYPE")}</p>
            <InputText
                name="delegateAccountNumber"
                placeholder={t("ENTER_COIN_TYPE")}
                required={false}
                type="text"
                className="form-control"
                value={coinType.value}
                error={coinType.error}
                onChange={onChange}
            />
        </div>
    );
};


export default CoinType;
