import React from "react";
import ReactQRCode from 'qrcode.react';
import Copy from "../../components/Copy";
// import {LOGIN_INFO} from "../../constants/localStorage";
import {useTranslation} from "react-i18next";

const Receive = ({address}) => {
    const {t} = useTranslation();
    // const loginInfo = JSON.parse(localStorage.getItem(LOGIN_INFO));
    return (
        <div className="receive-container">
            <ReactQRCode value={address && address}/>
            <p className="key">{t("WALLET_ADDRESS")}</p>
            <div className="address"><span>{address && address}</span> <Copy id={address && address}/></div>
        </div>
    );
};

export default Receive;