import React from 'react';
import {Form} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {setKeyStoreCoinType, setKeyStoreMnemonic} from "../../../store/actions/generateKeyStore";
import {useTranslation} from "react-i18next";
import {ValidateCoinType, ValidateMnemonic, ValidateStringSpaces} from "../../../utils/validations";

const Mnemonic = () => {
    const {t} = useTranslation();
    const mnemonic = useSelector((state) => state.generateKeyStore.mnemonic);
    const coinType = useSelector((state) => state.generateKeyStore.coinType);
    const dispatch = useDispatch();

    const onChange = (evt) => {
        dispatch(setKeyStoreMnemonic({
            value: evt.target.value,
            error: ValidateMnemonic(evt.target.value)
        }));
    };

    const onCoinTypeChange = (evt) => {
        dispatch(setKeyStoreCoinType({
            value: evt.target.value,
            error: ValidateCoinType(evt.target.value)
        }));
    };

    return (
        <div className="form-field">
            <p className="label">{t("ENTER_MNEMONIC")}</p>
            <div className="form-control-section flex-fill">
                <Form.Control as="textarea" rows={3} name="mnemonic"
                    placeholder={t("SEED_PHRASE")}
                    onKeyPress={ValidateStringSpaces}
                    onChange={onChange}
                    required={true}/>
                <p className="input-error">{mnemonic.error.message}</p>
            </div>
            <p className="label">{t("COIN_TYPE")}</p>
            <div className="form-control-section flex-fill">
                <Form.Control as="textarea" rows={3} name="coinType"
                    placeholder={t("ENTER_COIN_TYPE")}
                    onKeyPress={ValidateCoinType}
                    onChange={onCoinTypeChange}
                    required={false}/>
                <p className="input-error">{coinType.error.message}</p>
            </div>
        </div>
    );
};


export default Mnemonic;
