import React, {useRef, useState} from "react";
import {
    Form, Modal,
} from "react-bootstrap";
import Icon from "../../components/Icon";
import DownloadLink from "react-download-link";
import helper from "../../utils/helper";


const AddressImport = (props) => {
    const downloadLink = useRef();
    const [jsonName, setJsonName] = useState({});
    const [keyFile, setKeyFile] = useState(false);
    const [show, setShow] = useState(true);
    const handleSubmit = async event => {
        event.preventDefault();
        const password = event.target.password.value;
    };
    const handleClose = () => {
        setShow(false);
        props.handleRoute(props.routeValue)
    };
    const handlePrevious = (formName) => {
        if(formName === "generateKey"){
            setShow(false);
            props.handleRoute(props.routeValue)
        }
    };
    return (
        <Modal backdrop="static" show={show} onHide={handleClose} centered className="create-wallet-modal large seed">
            <Modal.Header closeButton>
                <div className="previous-section">
                    <button className="button" onClick={() => handlePrevious("generateKey")}>
                        <Icon
                            viewClass="arrow-right"
                            icon="left-arrow"/>
                    </button>
                </div>
                <h3 className="heading">Importing Wallet</h3>
            </Modal.Header>
            <div className="create-wallet-body create-wallet-form-body">
                <Form onSubmit={handleSubmit} className="form-privatekey">
                    <div className="form-field">
                        <p className="label">Address</p>
                        <Form.Control
                            type="text"
                            name="address"
                            id="addressImport"
                            placeholder="Enter Address"
                            required={true}
                        />
                    </div>
                    <div className="buttons">
                        <button className="button button-primary">Done</button>
                    </div>
                </Form>

            </div>
        </Modal>
    );
};
export default AddressImport;
