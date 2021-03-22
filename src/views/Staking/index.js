import React, {useState} from "react";
import Sidebar from "../../components/sidebar";
import Staking from "../../containers/Staking";
const DashboardStaking = () => {

    return (
        <div className="main-section">
            <Sidebar/>
            <div className="content-section">
                <Staking/>
            </div>
            <div>
            </div>
        </div>
    );
};
export default DashboardStaking;