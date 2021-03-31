import React, {useState} from "react";
import {Tab, Tabs} from "react-bootstrap";
import Send from "./Send";
import Receive from "./Receive";
import Transactions from "./Transactions/index"
import DashboardHeader from "../Common/DashboardHeader";
import TokenInfo from "../Common/TokenInfo";
const Wallet = () => {

    return (
        <div className="wallet-main-section">
            <TokenInfo/>
            <div className="tabs-section">
                <Tabs defaultActiveKey="Send" id="uncontrolled-tab-example">
                    <Tab eventKey="Send" title="Send">
                       <Send/>
                    </Tab>
                    <Tab eventKey="Recieve" title="Recieve">
                        <Receive/>
                    </Tab>
                    <Tab eventKey="Transactions" title="Transactions">
                        <Transactions/>
                    </Tab>
                </Tabs>
            </div>
            <div>
            </div>
        </div>
    );
};
export default Wallet;