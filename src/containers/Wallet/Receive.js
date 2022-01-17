import React from "react";
import ReactQRCode from 'qrcode.react';
import Copy from "../../components/Copy";
import {ADDRESS} from "../../constants/localStorage";

const Receive = () => {
    let address = localStorage.getItem(ADDRESS);
    return (
        <div className="receive-container">
            <ReactQRCode value={address}/>
            <p className="key">Wallet Address</p>
            <div className="address"><span>{address}</span> <Copy id={address}/></div>
        </div>
    );
};
export default Receive;