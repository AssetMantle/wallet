import React from "react";
import TokenInfo from "../Common/TokenInfo";
import Validators from "./Validators";
import DelegatedValidators from "./Validators/DelegatedValidators";
import {Nav, Tab} from "react-bootstrap";
import InfoRefresh from "../Refresh";

const Staking = () => {
    const handleTabs = (e) =>{
        console.log(e, "Tab");
    };
    return (
        <div className="staking-main-section">
            <TokenInfo/>
            <div className="validators-section">
                <div className="txns-container">
                    <Tab.Container id="left-tabs-example" onSelect={handleTabs} defaultActiveKey="all">
                        <div className="tab-header">
                            <div className="info">
                                <div className="left">
                                    <Nav variant="pills">
                                        <Nav.Item>
                                            <Nav.Link eventKey="all"> All Validators</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="delegated"> Delegated</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </div>
                                <div>
                                    <InfoRefresh/>
                                </div>
                                {/*<p className="info-value"><span>Lifetime Rewards: </span>125,000 XPRT</p>*/}
                            </div>
                        </div>
                        <Tab.Content>
                            <Tab.Pane eventKey="all">
                                <Validators/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="delegated">
                                <DelegatedValidators/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>


            </div>
        </div>
    );
};
export default Staking;
