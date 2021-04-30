import {Modal} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAccountUrl} from "../../../constants/url";
import axios from "axios";
import transactions from "../../../utils/transactions";
import {Table} from "react-bootstrap";
import moment from "moment";

const ModalViewVestingDetails = () => {
    const [show, setShow] = useState(false);
    const [showContinuesVesting, setShowContinuesVesting] = useState(false);
    const [showPeriodicVesting, setShowPeriodicVesting] = useState(false);
    const [showDelayedVesting, setShowDelayedVesting] = useState(false);
    const [response, setResponse] = useState("");
    const loginAddress = localStorage.getItem('address');
    const handleClose = () => {
        setShow(false);
    };
    const handleModal = () => {
        setShow(true);
    };

    useEffect(() => {
        const url = getAccountUrl(loginAddress);
        axios.get(url).then(response => {
            if (response.data.account["@type"] === "/cosmos.vesting.v1beta1.PeriodicVestingAccount") {
                setResponse(response.data.account);
                console.log(response.data.account, "PeriodicVestingAccount");
                setShowPeriodicVesting(true);
            } else if (response.data.account["@type"] === "/cosmos.vesting.v1beta1.DelayedVestingAccount") {
                setShowDelayedVesting(true);
                setResponse(response.data.account);
                console.log(response.data.account, "DelayedVestingAccount");
            } else if (response.data.account["@type"] === "/cosmos.vesting.v1beta1.ContinuousVestingAccount") {
                setShowContinuesVesting(true);
                setResponse(response.data.account);
                console.log(response.data.account, "ContinuousVestingAccount");
            }
        }).catch(error => {
            console.log(error.response
                ? error.response.data.message
                : error.message);
        });
    }, []);

    return (
        <>
            <Modal
                animation={false}
                centered={true}
                show={show}
                backdrop="static"
                size="lg"
                className="modal-custom faq-modal"
                onHide={handleClose}>
                <Modal.Header className="result-header" closeButton>
                    Vesting Schedule
                </Modal.Header>
                <Modal.Body className="faq-modal-body">
                    <ul className="modal-list-data">
                        {showContinuesVesting ?
                            response.base_vesting_account !== undefined ?
                                <Table borderless>
                                    <thead>
                                        <tr>
                                            <th>Unlocking Tokens</th>
                                            <th>From Date</th>
                                            <th>To Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{transactions.XprtConversion(parseInt(response.base_vesting_account.original_vesting[0].amount) )}</td>
                                            <td>{moment(new Date(parseInt(response.start_time) * 1000).toString()).format('dddd MMMM Do YYYY, h:mm:ss a')}</td>
                                            <td>{moment(new Date(parseInt(response.base_vesting_account.end_time) * 1000).toString()).format('dddd MMMM Do YYYY, h:mm:ss a')}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                : ""

                            : ""
                        }
                        {showPeriodicVesting ?
                            <>
                                <p>Your vesting schedule is as follows</p>
                                {response.base_vesting_account.original_vesting.length ?
                                    <>
                                        <p>Total vesting
                                            tokens {transactions.XprtConversion(parseInt(response.base_vesting_account.original_vesting[0].amount))} at
                                            Date {moment(new Date(parseInt(response.start_time) * 1000).toString()).format('dddd MMMM Do YYYY, h:mm:ss a')}</p>
                                        {
                                            response.vesting_periods.length ?
                                                response.vesting_periods.map((period, index) => {
                                                    let vestingPeriod = parseInt(response.start_time);
                                                    for (var i = 0; i <= index; i++) {
                                                        vestingPeriod = vestingPeriod + parseInt(response.vesting_periods[i].length);
                                                    }
                                                    return (
                                                        <Table key={index} borderless>
                                                            <thead>
                                                                <tr>
                                                                    <th>Unlocking Tokens</th>
                                                                    <th>Date</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>{transactions.XprtConversion(period.amount[0].amount)}</td>
                                                                    <td>{moment(new Date(vestingPeriod * 1000).toString()).format('dddd MMMM Do YYYY, h:mm:ss a')}</td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                    );
                                                })
                                                : ""
                                        }
                                    </>
                                    : ""
                                }
                            </>
                            : ""
                        }
                        {showDelayedVesting ?
                            response.base_vesting_account !== undefined ?
                                <Table borderless>
                                    <thead>
                                        <tr>
                                            <th>Unlocking Tokens</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{transactions.XprtConversion(parseInt(response.base_vesting_account.original_vesting[0].amount))}</td>
                                            <td>{moment(new Date(parseInt(response.base_vesting_account.end_time) * 1000).toString()).format('dddd MMMM Do YYYY, h:mm:ss a')}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                : ""

                            : ""
                        }
                    </ul>

                </Modal.Body>
            </Modal>
            <span className="view-button" onClick={handleModal}>View</span>
        </>

    );
};


const stateToProps = (state) => {
    return {
        list: state.unbond.list,
    };
};


export default connect(stateToProps)(ModalViewVestingDetails);

