import React from 'react';
import Button from "./../../../components/Button";
import {useDispatch, useSelector} from "react-redux";
import {mnemonicSubmit} from "../../../store/actions/generateKeyStore";

const ButtonSubmit = () => {
    const dispatch = useDispatch();
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));

    const onClick = () => {
        dispatch(mnemonicSubmit());
    };
    const mnemonic = useSelector((state) => state.generateKeyStore.mnemonic);

    const disable = (
        mnemonic.value === '' || mnemonic.error.message !== ''
    );

    console.log(loginInfo, "info");
    return (
        <div className="buttons">
            <div className="button-section">
                <Button
                    className="button button-primary"
                    type="button"
                    disable={disable}
                    value="Submit"
                    onClick={onClick}
                />
            </div>
        </div>
    );
};



export default ButtonSubmit;
