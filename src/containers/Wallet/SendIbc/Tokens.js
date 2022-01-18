import {setTxIbcSendToken} from '../../../store/actions/transactions/sendIbc';
import React, {useEffect} from 'react';
import transactions from "../../../utils/transactions";
import {useDispatch, useSelector} from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";
import config from "../../../config";
import {stringToNumber} from "../../../utils/scripts";

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
            setTxIbcSendToken({
                value: tokenData[0],
            })
        );
    }, []);

    const onTokenChangeSelect = (evt) => {
        dispatch(
            setTxIbcSendToken({
                value: [],
            })
        );
        tokenData = [];
        const tokenDataObject = {};
        tokenDataObject.token = evt.target.value;
        if (evt.target.value === config.coinDenom) {
            tokenDataObject.tokenDenom = evt.target.value;
            tokenDataObject.transferableAmount = transferableAmount;
        } else {
            tokenList.forEach((item) => {
                if (evt.target.value === item.denomTrace) {
                    tokenDataObject.tokenDenom = evt.target.value;
                    tokenDataObject.transferableAmount = transactions.TokenValueConversion(stringToNumber(item.amount));
                    tokenDataObject.tokenItem = item;
                }
            });
        }
        tokenData.push(tokenDataObject);
        dispatch(
            setTxIbcSendToken({
                value: tokenData[0],
            })
        );
    };

    return (
        <div className="form-field">
            <p className="label">{t("TOKEN")}</p>
            <div className="form-control-section flex-fill">
                <Select defaultValue={config.coinDenom} className="validators-list-selection"
                    onChange={onTokenChangeSelect} displayEmpty>
                    {
                        tokenList.map((item, index) => {
                            if (item.denom === config.coinDenom) {
                                return (
                                    <MenuItem
                                        key={index + 1}
                                        className=""
                                        value={item.denom}>
                                        {config.coinName}
                                    </MenuItem>
                                );
                            }
                            if (item.denom.baseDenom === "uatom") {
                                return (
                                    <MenuItem
                                        key={index + 1}
                                        className=""
                                        value={item.denomTrace}>
                                        ATOM ({item.denom.path})
                                    </MenuItem>
                                );
                            }
                        })
                    }
                </Select>
            </div>
        </div>
    );
};

export default Tokens;
