import React from "react";
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