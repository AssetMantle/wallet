import React from "react";
import ReactQRCode from 'qrcode.react';
import Copy from "../../components/Copy";
import {LOGIN_INFO} from "../../constants/localStorage";

const Receive = () => {
    const loginInfo = JSON.parse(localStorage.getItem(LOGIN_INFO));
    return (
        <div className="receive-container">
            <ReactQRCode value={loginInfo.address}/>
            <p className="key">Wallet Address</p>
            <div className="address"><span>{loginInfo.address}</span> <Copy id={loginInfo.address}/></div>
        </div>
    );
};

export default Receive;