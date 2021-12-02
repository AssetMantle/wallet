import React from "react";
import ToAddress from "./ToAddress";
import Tokens from "./Tokens";
import Amount from "./Amount";
import ButtonSend from "./ButtonSend";
import {useSelector} from "react-redux";
import Memo from "./Memo";

const Send = () => {

    // let mode = localStorage.getItem('loginMode');
    const response = useSelector(state => state.common.error);
    const txName = useSelector((state) => state.common.txName.value);

    console.log(response.error.message, txName.name, "error in index");


    return (
        <div className="send-container">
            <div className="form-section">
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
