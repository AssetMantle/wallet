import React, {useState} from "react";
import { connect } from 'react-redux';
import {Table, Modal} from "react-bootstrap";
import {showTxDelegateModal} from "../../../actions/transactions/delegate";

const Validators = (props) => {
    const handleDelegate = () =>{
        props.showModal();
    };
    return (
        <div className="txns-container">
            <Table borderless hover responsive>
                <thead>
                <tr>
                    <th>Validator</th>
                    <th>Voting Power</th>
                    <th>Comission</th>
                    <th>Status</th>
                    <th>Delegate</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="">cosmostation</td>
                    <td className="">4,250,000 (4.25%)</td>
                    <td className="">7.5%</td>
                    <td className=""> r</td>
                    <td className="">
                        <button type="button" className="button button-primary" onClick={handleDelegate}>Delegate</button>
                    </td>
                </tr>

                </tbody>
            </Table>
        </div>
    );
};

const actionsToProps = {
    showModal: showTxDelegateModal
};

export default connect(null, actionsToProps)(Validators);
