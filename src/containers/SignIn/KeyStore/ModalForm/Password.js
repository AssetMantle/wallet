import React from 'react';
import InputText from "../../../../components/InputText";
import helper from "../../../../utils/helper";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setTxKeyStorePassword} from "../../../../actions/transactions/keyStore";

const Password = () => {
    const {t} = useTranslation();
    const password = useSelector((state) => state.keyStore.password);
    const dispatch = useDispatch();

    const onChange = (evt) => {
        dispatch(setTxKeyStorePassword({
            value:evt.target.value,
            error: helper.passwordValidation(evt.target.value)
        }));
    };

    return (
        <>
            <div className="form-field">
                <p className="label info">{t("PASSWORD")}</p>
                <InputText
                    className="form-control"
                    name="password"
                    type="password"
                    value={password.value}
                    required={true}
                    error={password.error}
                    onKeyPress={helper.inputSpaceValidation}
                    placeholder={t("ENTER_PASSWORD")}
                    autofocus={false}
                    onChange={onChange}
                />
            </div>
        </>
    );
};


export default Password;
