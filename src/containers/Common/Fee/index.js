import React, {useEffect} from 'react';
import config from "../../../config";
import NumberView from "../../../components/NumberView";
import {formatNumber} from "../../../utils/scripts";
import transactions from "../../../utils/transactions";
import {useDispatch, useSelector} from "react-redux";
import {feeChangeHandler} from "../../../store/actions/transactions/fee";
import {ValidateFee} from "../../../utils/validations";

const Fee = () => {
    const dispatch = useDispatch();
    const transferableAmount = useSelector((state) => state.balance.transferableAmount);
    const amount = useSelector((state) => state.send.amount.value);
    const fee = useSelector((state) => state.fee.fee);
    const tokenPrice = useSelector((state) => state.tokenPrice.tokenPrice);
    const type = useSelector((state) => state.common.txName.value.name);
    const gas = useSelector((state) => state.gas.gas);
    useEffect(() => {
        dispatch(feeChangeHandler({
            value: {
                fee: (config.averageFee * (gas.value)),
                feeType: "Average"
            },
            error: ValidateFee(transferableAmount, config.averageFee * (gas.value), type, amount)
        }));
    }, [gas.value]);
    const handleFee = (fee, feeValue) => {
        dispatch(feeChangeHandler({
            value: {
                fee: (feeValue * (gas.value)),
                feeType: fee
            },
            error: ValidateFee(transferableAmount, feeValue * (gas.value), type, amount)
        }));
    };

    console.log(amount, "amount in fee", fee);
    const activeFeeState = fee.value.feeType;

    return (
        <>
            <div className="fee-container">
                <>
                    {
                        transferableAmount < config.averageFee ?
                            <div className={activeFeeState === "Low" ? "fee-box active" : "fee-box"}
                                onClick={() => handleFee("Low", config.lowFee)}>
                                <p className="title">Zero</p>
                                <p className="gas"><NumberView
                                    value={formatNumber(transactions.XprtConversion((gas.value) * config.lowFee) * tokenPrice)}/>$
                                </p>
                                <p className="xprt"><NumberView
                                    value={formatNumber(transactions.XprtConversion((gas.value) * config.lowFee))}/>XPRT
                                </p>
                            </div>
                            : null
                    }
                    <div className={activeFeeState === "Average" ? "fee-box active" : "fee-box"}
                        onClick={() => handleFee("Average", config.averageFee)}>
                        <p className="title">Low</p>
                        <p className="gas"><NumberView
                            value={formatNumber(transactions.XprtConversion((gas.value) * config.averageFee) * tokenPrice)}/>$
                        </p>
                        <p className="xprt"><NumberView
                            value={formatNumber(transactions.XprtConversion((gas.value) * config.averageFee))}/>XPRT
                        </p>
                    </div>
                    <div className={activeFeeState === "High" ? "fee-box active" : "fee-box"}
                        onClick={() => handleFee("High", config.highFee)}>
                        <p className="title">High</p>
                        <p className="gas"><NumberView
                            value={formatNumber(transactions.XprtConversion((gas.value) * config.highFee) * tokenPrice)}/>$
                        </p>
                        <p className="xprt"><NumberView
                            value={formatNumber(transactions.XprtConversion((gas.value) * config.highFee))}/>XPRT
                        </p>
                    </div>
                </>
            </div>
            <div className="form-field p-0">
                <p className="label"></p>
                <div className="amount-field">
                    <p className="amount-error text-center">
                        {fee.error &&
                        fee.error.message}
                        {gas.feeError &&
                        gas.feeError.message}
                    </p>
                </div>
            </div>
        </>
    );
};


export default Fee;
