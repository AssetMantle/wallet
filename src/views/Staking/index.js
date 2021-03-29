import React, {useState} from "react";
import Sidebar from "../../components/sidebar";
import Staking from "../../containers/Staking";
import DashboardHeader from "../../containers/Common/DashboardHeader";
const DashboardStaking = () => {

    return (
        <div className="main-section">
            <DashboardHeader/>
            <div className="content-section container">
                <Staking/>
            </div>
        </div>
    );
};
export default DashboardStaking;