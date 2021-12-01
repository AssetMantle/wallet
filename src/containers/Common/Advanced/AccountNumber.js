import React from 'react';
import InputFieldNumber from "../../../components/InputFieldNumber";
import {useSelector, useDispatch} from "react-redux";
import {ValidateAccountIndex, ValidateSpecialCharacters} from "../../../utils/validations";
import {useTranslation} from "react-i18next";
import {setAccountNumber} from "../../../store/actions/transactions/advanced";

const AccountNumber = () => {
    const {t} = useTranslation();
    // const token = useSelector((state) => state.send.token.value);
    const accountNumber = useSelector((state) => state.advanced.accountNumber);
    const dispatch = useDispatch();

    const onChange = (evt) => {
        dispatch(setAccountNumber({
            value:(evt.target.value*1),
            error:ValidateAccountIndex(evt.target.value)
        }));
    };


    return (
        <div className="form-field">
            <p className="label">{t("ACCOUNT_NUMBER")}</p>
            <InputFieldNumber
                max={4294967295}
                name="delegateAccountNumber"
                placeholder={t("ACCOUNT_NUMBER")}
                type="number"
                className="form-control"
                value={accountNumber.value}
                error={accountNumber.error}
                onChange={onChange}
                onKeyPress={ValidateSpecialCharacters}
                required={false}
            />
        </div>
    );
};


export default AccountNumber;
