import React, {useState, useEffect} from "react";
import {Modal, Form, Button, OverlayTrigger, Popover} from "react-bootstrap";
import Icon from "../../components/Icon";

const ImportWallet = () => {
    const [show, setShow] = useState(true);
    const [mnemonicForm, setMnemonicForm] = useState(true);
    const [passwordForm, setPasswordForm] = useState(false);
    const handleClose = () => {
        setShow(false);
    };

    const handleCreateForm = (name) =>{
        if(name === 'mnemonicForm'){
            setMnemonicForm(false);
            setPasswordForm(true);
        }
        if(name === "passwordForm"){
            setMnemonicForm(false);
            setPasswordForm(true);
        }
    };
    const popover = (
        <Popover id="popover-basic">
            <Popover.Content>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium
            </Popover.Content>
        </Popover>
    );
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered className="create-wallet-modal">
                {
                    mnemonicForm ?
                        <>
                            <Modal.Body className="create-wallet-body import-wallet-body">
                                <h3 className="heading">Importing Wallet
                                    <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
                                        <button className="icon-button"><Icon
                                            viewClass="arrow-right"
                                            icon="info"/></button>
                                    </OverlayTrigger>
                                </h3>
                                <Form>
                                    <p className="label">Enter Seed</p>
                                    <Form.Control as="textarea" rows={5} name="mnemonic"
                                                  placeholder="Enter Seed"
                                                  required={true}/>
                                    <div className="buttons">
                                        <button className="button button-primary" onClick={() => handleCreateForm("passwordForm")}>Next</button>
                                    </div>
                                </Form>

                            </Modal.Body>
                        </>
                        : null
                }
                {
                    passwordForm ?
                        <Modal.Body className="create-wallet-body import-wallet-body">
                            <h3 className="heading">Importing Wallet</h3>
                            <Form>
                                <p className="label">Enter Password</p>
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        name="amount"
                                        placeholder="Enter Your Wallet Password"
                                        required={true}
                                    />
                                </Form.Group>
                                <div className="buttons">
                                    <button className="button button-primary" >Login</button>
                                </div>
                            </Form>

                        </Modal.Body>
                        : null
                }
            </Modal>

        </div>

    );
};
export default ImportWallet;
