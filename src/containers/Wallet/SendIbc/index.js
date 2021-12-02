import React from "react";
import ToAddress from "./ToAddress";
import Tokens from "./Tokens";
import Amount from "./Amount";
import ButtonSend from "./ButtonSend";
import {useSelector} from "react-redux";
import Memo from "./Memo";
import Chain from "./Chain";
import CustomChain from "./CustomChain";
const Send = () => {
    const chainInfo = useSelector((state) => state.sendIbc.chainInfo.value);
    const response = useSelector(state => state.common.error);
    const txName = useSelector((state) => state.common.txName.value);

    return (
        <div className="send-container">
            <div className="form-section">
                <Chain/>
                {chainInfo.customChain ?
                    <CustomChain/>
                    : null
                }
                <ToAddress/>
                <Tokens/>
                <Amount/>
                <Memo/>
                {response.error.message !== '' && txName.name === "send" ?
                    <p className="form-error">{response.error.message}</p> : null}
                <ButtonSend/>
            </div>
        </div>
    );
};



export default Send;
