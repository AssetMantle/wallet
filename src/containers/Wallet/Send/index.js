import React from "react";
import ToAddress from "./ToAddress";
import Tokens from "./Tokens";
import Amount from "./Amount";
import ButtonSend from "./ButtonSend";
// import {useSelector} from "react-redux";
import Memo from "./Memo";

const Send = () => {

    // let mode = localStorage.getItem('loginMode');
    // const error = useSelector(state => state.common.error);
    // const txName = useSelector((state) => state.common.txName.value.name);

    // console.log(error, "error in index");


    return (
        <div className="send-container">
            <div className="form-section">
                <ToAddress/>
                <Tokens/>
                <Amount/>
                <Memo/>
                {/*{error !== '' && txName === "send" ?*/}
                {/*    <p className="form-error">{error.error.message}</p> : null}*/}
                <ButtonSend/>
            </div>
        </div>
    );
};



export default Send;
