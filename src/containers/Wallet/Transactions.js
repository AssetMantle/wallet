import React, {useState} from "react";
import {Table, Modal} from "react-bootstrap";
const Transactions = () => {

    return (
        <div className="txns-container">
            <Table borderless hover responsive>
                <thead>
                <tr>
                    <th>Tx Hash</th>
                    <th>Type</th>
                    <th>Result</th>
                    <th>Amount</th>
                    <th>Fee</th>
                    <th>Height</th>
                    <th>Time</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="tx-hash">0BB6C0...638088</td>
                    <td className="type">Recieve</td>
                    <td className="result">r</td>
                    <td className="amount"> + 60.04XPRT</td>
                    <td className="fee">0.002500XPRT</td>
                    <td className="height">5504339</td>
                    <td className="time">9s ago</td>
                </tr>

                </tbody>
            </Table>
        </div>
    );
};
export default Transactions