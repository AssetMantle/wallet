import {Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import {connect} from "react-redux";
import transactions from "../../../utils/transactions";

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
                    Unbonding Schedule
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
                                                <p><span className="date">{new Date (entry["completion_time"]).toUTCString()}</span></p>
                                            </div>
                                        );
                                    })
                                    : ""
                            );
                        }) : null
                    }
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


export default connect(stateToProps)(ModalViewUnbondDetails);

