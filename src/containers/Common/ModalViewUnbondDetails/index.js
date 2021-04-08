import {Form, Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {connect} from "react-redux";

const ModalViewUnbondDetails = (props) => {
    const {t} = useTranslation();
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
                className="modal-custom faq-modal"
                onHide={handleClose}>
                <Modal.Header className="result-header" closeButton>
                    Unbonding Schedule
                </Modal.Header>
                <Modal.Body className="faq-modal-body">
                    <ul>
                    {props.list ?
                        props.list.map((item, index) => {
                            return (
                                item.entries.length ?
                                    item.entries.map((entry, entryIndex) => {
                                        return (
                                            <li className="unbonding-schedule-list"><span className="amount">{entry.balance / 1000000} XPRT</span> to be unbonded on <span className="date">{new Date (entry["completion_time"]).toUTCString()}</span></li>
                                        )
                                    })
                                    : ""
                            )
                        }) : null
                    }
                    </ul>
                </Modal.Body>
            </Modal>
            <VisibilityIcon onClick={handleModal} className="icon-button"/>
        </>

    );
};


const stateToProps = (state) => {
    return {
        list: state.unbond.list,
    };
};


export default connect(stateToProps)(ModalViewUnbondDetails);

