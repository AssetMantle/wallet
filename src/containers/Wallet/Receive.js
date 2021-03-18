import React, {useState} from "react";
import ReactQRCode from 'qrcode.react';
import Copy from "../../components/Copy";
const Receive = () => {

    return (
        <div className="receive-container">
            <ReactQRCode value="http://facebook.github.io/react/"/>
            <p className="key">Wallet Address</p>
            <p className="address">XPR47rueyd4t19hry57v43bx9wef9u39z637s29fuf4y6rhk8ocv <Copy id="XPR47rueyd4t19hry57v43bx9wef9u39z637s29fuf4y6rhk8ocv"/> </p>
        </div>
    );
};
export default Receive;