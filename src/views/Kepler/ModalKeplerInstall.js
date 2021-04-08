import {Form, Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import chrome from "../../assets/images/chrome.svg"
const ModalKeplerInstall = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
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
                size="lg"
                className="kepler-modal"
                onHide={handleClose}>
                <Modal.Body className="kepler-modal-body">
                    <p>Please Install the Keplr browser extension to start using Keplr</p>
                    <div className="chrome-box">
                        <a className="chrome-link" href="https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap" rel="noopener noreferrer" target="_blank">
                            <img src={chrome} alt="chrome"/>
                            <p>Install for Chrome</p>
                        </a>

                    </div>
                    <p onClick={handleClose} className="installed-note">Already Installed ?</p>
                </Modal.Body>
            </Modal>
        </>

    );
};



export default ModalKeplerInstall;

