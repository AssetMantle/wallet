import React from "react";
import Wallet from "../../containers/Wallet";
import DashboardHeader from "../../containers/Common/DashboardHeader";

const DashboardWallet = () => {

    return (
        <div className="main-section">
            <DashboardHeader/>
            <div className="content-section container">
                <Wallet/>
            </div>
        </div>
    );
};
export default DashboardWallet;
