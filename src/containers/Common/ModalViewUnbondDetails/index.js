import {Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import {connect} from "react-redux";
import transactions from "../../../utils/transactions";
import moment from "moment";

const ModalViewUnbondDetails = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    const handleModal = () => {
        setShow(true);
    };

    return (
        <>
            <Modal
                animation={false}
                centered={true}
                show={show}
                backdrop="static"
                size="lg"
                className="modal-custom list-modal"
                onHide={handleClose}>
                <Modal.Header className="result-header" closeButton>
                    View Unbonding XPRT Schedule
                </Modal.Header>
                <Modal.Body className="list-modal-body">
                    <div className="unbonding-schedule-list-header">
                        <p>To be Unbonded</p>
                        <p>Date</p>
                    </div>
                    {props.list ?
                        props.list.map((item) => {
                            return (
                                item.entries.length ?
                                    item.entries.map((entry, entryIndex) => {
                                        return (
                                            <div className="unbonding-schedule-list" key={entryIndex}>
                                                <p><span className="amount">{transactions.XprtConversion(entry.balance*1)} XPRT</span></p>
                                                <p><span className="date">{moment(new Date (entry["completion_time"]).toString()).format('dddd MMMM Do YYYY, h:mm:ss a')}</span></p>
                                            </div>
                                        );
                                    })
                                    : ""
                            );
                        }) : null
                    }
                </Modal.Body>
            </Modal>
            <span className="view-button" onClick={handleModal} title="View Unbonding XPRT Schedule">View</span>
        </>

    );
};


const stateToProps = (state) => {
    return {
        list: state.unbond.list,
    };
};


export default connect(stateToProps)(ModalViewUnbondDetails);

