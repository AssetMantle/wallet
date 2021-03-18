import React, {useState} from "react";
import Sidebar from "../../components/sidebar";
import Staking from "../../containers/Staking";
import ModalDelegate from "../../containers/Staking/Validators/ModalDelegate";
const DashboardStaking = () => {

    return (
        <div className="main-section">
            <ModalDelegate/>
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