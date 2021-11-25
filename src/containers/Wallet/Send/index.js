import React from "react";
import ToAddress from "./ToAddress";
import Tokens from "./Tokens";
import Amount from "./Amount";
import ButtonSend from "./ButtonSend";
import ModalViewTxnResponse from "../../Common/ModalViewTxnResponse";
import {useSelector} from "react-redux";
import Loader from "../../../components/Loader";
import Memo from "./Memo";
import KeyStoreModal from "../../Common/KeyStore/Modal";

const Send = () => {

    // let mode = localStorage.getItem('loginMode');
    const inProgress = useSelector(state => state.common.inProgress);
    const error = useSelector(state => state.common.error);

    console.log(error, "error in index");

    if (inProgress) {
        return <Loader/>;
    }

    return (
        <div className="send-container">
            <div className="form-section">
                <ToAddress/>
                <Tokens/>
                <Amount/>
                <Memo/>
                {error !== '' ?
                    <p className="form-error">{error.error.message}</p> : null}
                <ButtonSend/>
            </div>
            <ModalViewTxnResponse/>
            <KeyStoreModal/>
        </div>
    );
};



export default Send;
