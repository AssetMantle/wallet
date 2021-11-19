import {setTxSendToken} from '../../../store/actions/transactions/send';
import React, {useEffect} from 'react';
import transactions from "../../../utils/transactions";
import {useDispatch, useSelector} from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const Tokens = () => {
    const tokenList = useSelector((state) => state.balance.tokenList);
    const transferableAmount = useSelector((state) => state.balance.transferableAmount);
    const dispatch = useDispatch();
    const tokenData=[];
    useEffect(()=>{
        const initialObject ={
            tokenDenom:'uxprt',
            token:'uxprt',
            transferableAmount:transferableAmount
        };
        tokenData.push(initialObject);
        dispatch(
            setTxSendToken({
                value: tokenData[0],
            })
        );
    },[]);
    console.log(tokenList, "tokenList");
    const onChangeSelect = (evt) => {
        const tokenDataObject={};
        console.log(evt.target.value, "tokenvalue");
        tokenDataObject.token = evt.target.value;
        if (evt.target.value === 'uxprt') {
            tokenDataObject.tokenDenom = evt.target.value;
            tokenDataObject.transferableAmount = transferableAmount;
        } else {
            tokenList.forEach((item) => {
                if (evt.target.value === item.denomTrace) {
                    tokenDataObject.tokenDenom = item.denom.baseDenom;
                    tokenDataObject.transferableAmount = transactions.XprtConversion(item.amount * 1);
                    tokenDataObject.tokenItem = item;
                }
            });
        }
        tokenData.push(tokenDataObject);
        console.log(tokenData, "tokenData");
        dispatch(
            setTxSendToken({
                value: tokenData[0],
            })
        );
    };

    return (
        <div className="form-field">
            <p className="label">TOKEN</p>
            {/*<SelectField*/}
            {/*    className="validators-list-selection"*/}
            {/*    items={tokenList}*/}
            {/*    value={token.length ? token.token : 'uxprt'}*/}
            {/*    menuItemClassName=""*/}
            {/*    onChange={onChangeSelect}*/}
            {/*/>*/}

            <Select
                className="validators-list-selection"
                displayEmpty={true}
                defaultValue={'uxprt'}
                required={true}
                onChange={onChangeSelect}>
                <MenuItem
                    className=""
                    value="uxprt">
                    XPRT
                </MenuItem>
            </Select>
        </div>
       
    );
};

export default Tokens;
