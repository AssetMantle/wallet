import {
    Modal,
} from 'react-bootstrap';
import React, {useState} from 'react';
import {useTranslation} from "react-i18next";

const ModalGasAlert = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const handleClose = () => {
        setShow(false);
        props.setZeroFeeAlert(false);
    };

    return (
        <Modal
            animation={false}
            centered={true}
            keyboard={false}
            backdrop="static"
            show={show}
            className="modal-custom zero-fee-modal"
            onHide={handleClose}>
            <>
                <Modal.Header className="result-header success" closeButton>
                   Alert
                </Modal.Header>
                <Modal.Body className="delegate-modal-body">
                    <div>
                        <p className="fee-alert">{t("ZERO_FEE_WARNING")}</p>
                    </div>
                </Modal.Body>
            </>
        </Modal>
    );
};


export default ModalGasAlert;
