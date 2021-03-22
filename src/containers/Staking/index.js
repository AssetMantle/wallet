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

                <Validators/>
            </div>
        </div>
    );
};
export default Staking;