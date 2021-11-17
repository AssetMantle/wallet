import React from 'react';
import InputFieldNumber from "../../../components/InputFieldNumber";
import {useSelector, useDispatch} from "react-redux";
import {ValidateAccountIndex, ValidateSpecialCharacters} from "../../../utils/validations";
import {useTranslation} from "react-i18next";
import {setAccountIndex} from "../../../actions/transactions/advanced";

const AccountIndex = () => {
    const {t} = useTranslation();
    // const token = useSelector((state) => state.send.token.value);
    const accountIndex = useSelector((state) => state.advanced.accountIndex);
    const dispatch = useDispatch();

    const onChange = (evt) => {
        dispatch(setAccountIndex({
            value:(evt.target.value*1),
            error:ValidateAccountIndex(evt.target.value)
        }));
    };


    return (
        <div className="form-field">
            <p className="label">{t("ACCOUNT_INDEX")}</p>
            <InputFieldNumber
                min={0}
                max={4294967295}
                name="delegateAccountIndex"
                placeholder={t("ACCOUNT_INDEX")}
                type="number"
                className="form-control"
                value={accountIndex.value}
                error={accountIndex.error}
                onChange={onChange}
                onKeyPress={ValidateSpecialCharacters}
                required={false}
            />
        </div>
    );
};


export default AccountIndex;
