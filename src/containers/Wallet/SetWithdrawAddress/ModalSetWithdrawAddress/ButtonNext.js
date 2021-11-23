import React from 'react';
import Button from "./../../../../components/Button";
import {useDispatch, useSelector} from "react-redux";
import {keplrSubmit} from "../../../../store/actions/transactions/keplr";
import {submitFormData} from "../../../../store/actions/transactions/setWithdrawAddress";
import {SetWithDrawAddressMsg} from "../../../../utils/protoMsgHelper";

const ButtonNext = () => {
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(submitFormData([SetWithDrawAddressMsg(loginInfo.address,revisedAddress.value)]));
    };

    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    let revisedAddress = useSelector((state) => state.setWithdrawAddress.revisedAddress);
    const currentAddress = useSelector((state) => state.withdrawAddress.withdrawAddress);

    const onClickKeplr = () => {
        dispatch(keplrSubmit([SetWithDrawAddressMsg(loginInfo.address,revisedAddress.value)]));
    };

    const disable = (
        revisedAddress.error.message !== '' || currentAddress === '' || revisedAddress.value === ''
    );

    return (
        <div className="buttons">
            <div className="button-section">
                <Button
                    className="button button-primary"
                    type="button"
                    disable={disable}
                    value="Next"
                    onClick={loginInfo.loginMode === "keplr" ? onClickKeplr : onClick}
                />
            </div>
        </div>
    );
};



export default ButtonNext;
