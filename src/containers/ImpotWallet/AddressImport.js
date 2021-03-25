import React, {useRef, useState} from "react";
import {
    Form, Modal,
} from "react-bootstrap";
import Icon from "../../components/Icon";
import {getAccountUrl} from "../../constants/url";
import axios from "axios";
import {useHistory} from "react-router-dom";

const AddressImport = (props) => {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState("");
    const [show, setShow] = useState(true);
    const handleSubmit = async event => {
        event.preventDefault();
        setErrorMessage("");
        const address = event.target.address.value;
        const url = getAccountUrl(address)
        await axios.get(url).then(response => {
            if(response.data.code === undefined){
                localStorage.setItem('loginToken', 'loggedIn');
                localStorage.setItem('address', address);
                history.push('/dashboard/wallet');
            }
            setShow(false);
        }).catch(error => {
            setErrorMessage(error.response.data.message);
        });
    };
    const handleClose = () => {
        setShow(false);
        props.handleClose()
    };
    const handlePrevious = (formName) => {
        if(formName === "addressImport"){
            setShow(false);
            props.handleRoute(props.routeValue);
        }
    };
    return (
        <Modal backdrop="static" show={show} onHide={handleClose} centered className="create-wallet-modal large seed">
            <Modal.Header closeButton>
                <div className="previous-section">
                    <button className="button" onClick={() => handlePrevious("addressImport")}>
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
                    {errorMessage !== ''
                        ? <p className="form-error">{errorMessage}</p>
                        : null

                    }
                    <div className="buttons">
                        <button className="button button-primary">Submit</button>
                    </div>
                </Form>

            </div>
        </Modal>
    );
};
export default AddressImport;
