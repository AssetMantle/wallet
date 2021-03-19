import React, {useState} from "react";
import Header from "../Common/Header";
import TokenInfo from "../Common/TokenInfo";
import Validators from "./Validators";
const Staking = () => {

    return (
        <div className="staking-main-section">
            <Header name="Staking"/>
            <TokenInfo/>
            <div className="validators-section">
                <div className="info">
                    <p className="info-name">Choose a Validator</p>
                    <p className="info-value"><span>Lifetime Rewards: </span>125,000 XPRT</p>
                </div>
                <Validators/>
            </div>
        </div>
    );
};
export default Staking;