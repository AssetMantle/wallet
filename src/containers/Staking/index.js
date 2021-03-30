import React from "react";
import TokenInfo from "../Common/TokenInfo";
import Validators from "./Validators";
const Staking = () => {

    return (
        <div className="staking-main-section">
            <TokenInfo/>
            <div className="validators-section">
                <Validators/>
            </div>
        </div>
    );
};
export default Staking;