import React, {useState} from "react";
import Sidebar from "../../components/sidebar";
import Wallet from "../../containers/Wallet";
const DashboardWallet = () => {

    return (
        <div className="main-section">
            <Sidebar/>
            <div className="content-section">
                <Wallet/>
            </div>
            <div>
            </div>
        </div>
    );
};
export default DashboardWallet;