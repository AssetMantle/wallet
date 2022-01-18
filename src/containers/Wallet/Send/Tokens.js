import {setTxSendToken} from '../../../store/actions/transactions/send';
import React, {useEffect} from 'react';
import transactions from "../../../utils/transactions";
import {useDispatch, useSelector} from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";
import config from "../../../config";
import helper from "../../../utils/helper";

const Tokens = () => {
    const {t} = useTranslation();
    const tokenList = useSelector((state) => state.balance.tokenList);
    const transferableAmount = useSelector((state) => state.balance.transferableAmount);
    const dispatch = useDispatch();
    let tokenData = [];

    useEffect(() => {
        const initialObject = {
            tokenDenom: config.coinDenom,
            token: config.coinDenom,
            transferableAmount: transferableAmount
        };
        tokenData.push(initialObject);
        dispatch(
            setTxSendToken({
                value: tokenData[0],
            })
        );
    }, []);

    const onChangeSelect = (evt) => {
        const tokenDataObject = {};
        dispatch(
            setTxSendToken({
                value: [],
            })
        );
        tokenData = [];
        tokenDataObject.token = evt.target.value;
        if (evt.target.value === config.coinDenom) {
            tokenDataObject.tokenDenom = evt.target.value;
            tokenDataObject.transferableAmount = transferableAmount;
        } else {
            tokenList.forEach((item) => {
                if (evt.target.value === item.denomTrace) {
                    tokenDataObject.tokenDenom = item.denom.baseDenom;
                    tokenDataObject.transferableAmount = transactions.TokenValueConversion(helper.stringToNumber(item.amount ));
                    tokenDataObject.tokenItem = item;
                }
            });
        }
        tokenData.push(tokenDataObject);
        dispatch(
            setTxSendToken({
                value: tokenData[0],
            })
        );
    };

    return (
        <div className="form-field">
            <p className="label">{t("TOKEN")} </p>
            <div className="form-control-section flex-fill">
                <Select
                    className="validators-list-selection"
                    displayEmpty={true}
                    defaultValue={config.coinDenom}
                    required={true}
                    onChange={onChangeSelect}>
                    <MenuItem
                        className=""
                        value={config.coinDenom}>
                        {config.coinName}
                    </MenuItem>
                </Select>
            </div>
        </div>

    );
};

export default Tokens;
