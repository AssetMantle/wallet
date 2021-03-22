import React, {useState} from "react";
import ReactQRCode from 'qrcode.react';
import Copy from "../../components/Copy";
const Receive = () => {

    return (
        <div className="receive-container">
            <ReactQRCode value="persistence1095fgex3h37zl4yjptnsd7qfmspesvav7xhgwt"/>
            <p className="key">Wallet Address</p>
            <div className="address"><span>XPR47rueyd4t19hry57v43bx9wef9u39z637s29fuf4y6rhk8ocv</span> <Copy id="XPR47rueyd4t19hry57v43bx9wef9u39z637s29fuf4y6rhk8ocv"/> </div>
        </div>
    );
};
export default Receive;