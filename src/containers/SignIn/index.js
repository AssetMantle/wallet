import {Tab, Nav, Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import Icon from "../../components/Icon";
import AddressImport from "../ImpotWallet/AddressImport";
import {useHistory} from "react-router-dom";


const SignIn = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [withAddress, setWithAddress] = useState(false);
    const handleClose = () => {
        setShow(false);
        props.setRoutName("");
    };
    const handleRoute = (key) => {
        if (key === "withAddress") {
            setWithAddress(true);
            setShow(false)
        }
    };

    const handleKepler = () => {
        history.push('/kepler');
    }
    return (
        <>
            <Modal backdrop="static" show={show} onHide={handleClose} centered
                   className="create-wallet-modal seed">
                <>
                    <Modal.Header closeButton>
                        <h3 className="heading"> SignIn</h3>
                    </Modal.Header>
                    <Modal.Body className="create-wallet-body create-wallet-form-body sign-in-buttons">
                        <div className="buttons">
                            <button className="button button-primary" onClick={() => handleKepler("kepler")}>Use Kepler
                            </button>
                        </div>
                        <div className="buttons">
                            <button className="button button-primary large"
                                    onClick={() => handleRoute("withAddress")}>Continue with Address
                            </button>
                        </div>
                    </Modal.Body>
                </>
            </Modal>
            {withAddress ?
                <AddressImport setWithAddress={setWithAddress} handleClose={handleClose} setShow={setShow}
                              />
                : null
            }
        </>
    );
};


export default SignIn;
