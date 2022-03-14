import {setTxSendToken} from '../../../store/actions/transactions/send';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";
import config from "../../../config";
// import {stringToNumber} from "../../../utils/scripts";
// import {tokenValueConversion} from "../../../utils/helper";
import {Decimal} from "@cosmjs/math";
import {unDecimalize} from "../../../utils/scripts";


const Tokens = () => {
    const {t} = useTranslation();
    const tokenList = useSelector((state) => state.balance.tokenList);
    const transferableAmount = useSelector((state) => state.balance.transferableAmount);
    const dispatch = useDispatch();
    console.log(tokenList, "tokenList");
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
        console.log(evt.target.value, "evt.target.value");

        if (evt.target.value === config.coinDenom) {
            tokenDataObject.tokenDenom = evt.target.value;
            tokenDataObject.transferableAmount = transferableAmount;
        } else {
            tokenList.forEach((item) => {
                if (evt.target.value === item.denomTrace) {
                    tokenDataObject.tokenDenom = item.denom.baseDenom;
                    tokenDataObject.transferableAmount = item.amount;
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
                            if (item.denom.baseDenom === "gravity0xfB5c6815cA3AC72Ce9F5006869AE67f18bF77006") {
                                console.log(Decimal.fromAtomics(item.amount, 18).toString(), "hellooo", Number(unDecimalize(Decimal.fromAtomics(item.amount, 18).toString(), 18)).toString());
                                return (
                                    <MenuItem
                                        key={index + 1}
                                        className=""
                                        value={item.denomTrace}>
                                        PSTAKE ({item.denom.path})
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
