import React, {useEffect} from 'react';
import config from "../../../testConfig.json";
import NumberView from "../../../components/NumberView";
import {formatNumber} from "../../../utils/scripts";
import {useDispatch, useSelector} from "react-redux";
import {feeChangeHandler} from "../../../store/actions/transactions/fee";
import {ValidateFee} from "../../../utils/validations";
import {tokenValueConversion} from "../../../utils/helper";

const Fee = () => {
    const dispatch = useDispatch();
    const transferableAmount = useSelector((state) => state.balance.transferableAmount);
    let amount = 0;
    const formData = useSelector((state) => state.common.txInfo.value.data);
    const fee = useSelector((state) => state.fee.fee);
    const tokenPrice = useSelector((state) => state.tokenPrice.tokenPrice);
    const type = useSelector((state) => state.common.txName.value.name);
    const gas = useSelector((state) => state.gas.gas);

    if(type === "send" || type === "ibc"){
        amount = formData.amount;
    }

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
                                    value={formatNumber(tokenValueConversion((gas.value) * config.lowFee) * tokenPrice)}/>$
                                </p>
                                <p className="token"><NumberView
                                    value={formatNumber(tokenValueConversion((gas.value) * config.lowFee))}/>
                                {config.coinName}
                                </p>
                            </div>
                            : null
                    }
                    <div className={activeFeeState === "Average" ? "fee-box active" : "fee-box"}
                        onClick={() => handleFee("Average", config.averageFee)}>
                        <p className="title">Low</p>
                        <p className="gas"><NumberView
                            value={formatNumber(tokenValueConversion((gas.value) * config.averageFee) * tokenPrice)}/>$
                        </p>
                        <p className="token"><NumberView
                            value={formatNumber(tokenValueConversion((gas.value) * config.averageFee))}/>
                        {config.coinName}
                        </p>
                    </div>
                    <div className={activeFeeState === "High" ? "fee-box active" : "fee-box"}
                        onClick={() => handleFee("High", config.highFee)}>
                        <p className="title">High</p>
                        <p className="gas"><NumberView
                            value={formatNumber(tokenValueConversion((gas.value) * config.highFee) * tokenPrice)}/>$
                        </p>
                        <p className="token"><NumberView
                            value={formatNumber(tokenValueConversion((gas.value) * config.highFee))}/>
                        {config.coinName}
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
