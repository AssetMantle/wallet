import {Modal} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getAccountUrl} from "../../../constants/url"
import axios from "axios";

const ModalViewVestingDetails = () => {
    const [show, setShow] = useState(false);
    const [showContinuesVesting, setShowContinuesVesting] = useState(false);
    const [showPeriodicVesting, setShowPeriodicVesting] = useState(false);
    const [showDelayedVesting, setShowDelayedVesting] = useState(false);
    const [response, setResponse] = useState("");
    const loginAddress = localStorage.getItem('address')
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
                setShowPeriodicVesting(true);
            } else if (response.data.account["@type"] === "/cosmos.vesting.v1beta1.DelayedVestingAccount") {
                setShowDelayedVesting(true);
                setResponse(response.data.account)
            } else if (response.data.account["@type"] === "/cosmos.vesting.v1beta1.ContinuousVestingAccount") {
                setShowContinuesVesting(true);
                setResponse(response.data.account);
            }
        }).catch(error => {
            console.log(error.response
                ? error.response.data.message
                : error.message)
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
                                <li className="unbonding-schedule-list">Unlocking {parseInt(response.base_vesting_account.original_vesting[0].amount) / 1000000} XPRT
                                    tokens
                                    from {(new Date(parseInt(response.start_time) * 1000)).toUTCString()} to {(new Date(parseInt(response.base_vesting_account.end_time) * 1000)).toUTCString()} continuously</li>
                                : ""

                            : ""
                        }
                        {showPeriodicVesting ?
                            <>
                                <p>Your vesting schedule is as follows</p>
                                {response.base_vesting_account.original_vesting.length ?
                                    <>
                                        <p>Total vesting
                                            tokens {parseInt(response.base_vesting_account.original_vesting[0].amount) / 1000000} at
                                            Date {(new Date(parseInt(response.start_time) * 1000)).toUTCString()}</p>
                                        {
                                            response.vesting_periods.length ?
                                                response.vesting_periods.map((period, index) => {
                                                    let vestingPeriod = parseInt(response.start_time);
                                                    for (var i = 0; i <= index; i++) {
                                                        vestingPeriod = vestingPeriod + parseInt(response.vesting_periods[i].length);
                                                    }
                                                    return (
                                                        <li className="unbonding-schedule-list" key={index}>Unlocking
                                                            tokens {period.amount[0].amount / 1000000} XPRT at
                                                            Date {(new Date(vestingPeriod * 1000)).toUTCString()}</li>
                                                    )
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
                                <li className="unbonding-schedule-list">Unlocking {parseInt(response.base_vesting_account.original_vesting[0].amount) / 1000000} XPRT
                                    tokens
                                    on {(new Date(parseInt(response.base_vesting_account.end_time) * 1000)).toUTCString()}
                                </li>
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

