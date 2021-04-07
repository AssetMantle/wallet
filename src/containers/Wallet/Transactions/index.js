import React from "react";
import {Tab, Nav,} from "react-bootstrap";
import SendTransactions from "./SendTransactions";
import ReceiveTransactions from "./ReceiveTransactions";

const Transactions = () => {
    return (
        <div className="txns-container">
            <Tab.Container id="left-tabs-example" defaultActiveKey="active">
                <div className="tab-header">
                    <div className="info">
                        <div className="left">
                            <Nav variant="pills">
                                <Nav.Item>
                                    <Nav.Link eventKey="active">sent</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="inactive">Received</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                        {/*<p className="info-value"><span>Lifetime Rewards: </span>125,000 XPRT</p>*/}
                    </div>

                </div>
                <Tab.Content>
                    <Tab.Pane eventKey="active">
                        <SendTransactions/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="inactive">
                        <ReceiveTransactions/>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    );
};


export default Transactions;
