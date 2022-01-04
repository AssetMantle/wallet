import React, {useState} from 'react';
import InputFieldNumber from "../../../components/InputFieldNumber";
import {useDispatch, useSelector} from "react-redux";
import {ValidateFee, ValidateGas} from "../../../utils/validations";
import {useTranslation} from "react-i18next";
import Icon from "../../../components/Icon";
import {setTxGas} from "../../../store/actions/transactions/gas";
import config from "../../../config";
import helper from "../../../utils/helper";

const Gas = () => {
    const {t} = useTranslation();
    const [showGasField, setShowGasField] = useState(false);
    const amount = useSelector((state) => state.send.amount);
    const gas = useSelector((state) => state.gas.gas);
    const transferableAmount = useSelector((state) => state.balance.transferableAmount);
    const type = useSelector((state) => state.common.txName.value.name);

    const dispatch = useDispatch();

    const onChange = (evt) => {
        dispatch(setTxGas({
            value: (helper.stringToNumber(evt.target.value)),
            feeError: ValidateFee(transferableAmount, config.averageFee * config.gas, type, amount),
            error: ValidateGas(evt.target.value)
        }));
    };

    const handleGas = () => {
        setShowGasField(!showGasField);
    };

    return (
        <div className="advanced-wallet-accordion">
            <div className="select-gas">
                <p onClick={handleGas} className="text-center">{!showGasField ? t('ADVANCED') : t('ADVANCED')}
                    {!showGasField ?
                        <Icon
                            viewClass="arrow-right"
                            icon="down-arrow"/>
                        :
                        <Icon
                            viewClass="arrow-right"
                            icon="up-arrow"/>}
                </p>
            </div>
            <div className={`form-field accordion-body ${showGasField ? 'show' : ''}`}>
                <p className="label info">{t("GAS")}</p>
                <div className="amount-field">
                    <InputFieldNumber
                        min={config.minGas}
                        max={config.maxGas}
                        name="gas"
                        placeholder={t("ENTER_GAS")}
                        step="any"
                        required={false}
                        type="number"
                        className="form-control"
                        value={gas.value}
                        error={gas.error}

                        onChange={onChange}
                    />
                </div>
            </div>
        </div>


    );
};


export default Gas;
