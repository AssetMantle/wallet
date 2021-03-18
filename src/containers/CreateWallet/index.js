import React, {useState, useEffect} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import Icon from "../../components/Icon";

const CreateWallet = (props) => {
    const [show, setShow] = useState(true);
    const [modal1, setModal1] = useState(true);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const [modal4, setModal4] = useState(false);
    const [createWalletForm, setCreateWalletForm] = useState(false);
    const [keysForm, setKeysForm] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    const handlePrevious = (index) => {
        if (index === 1) {
            setModal1(true)
            setModal2(false)
        }
        if (index === 2) {
            setModal2(true);
            setModal3(false)
        }
        if (index === 3) {
            setModal3(true);
            setModal4(false)
        }
    };
    const handleNext = (index) => {
        if (index === 2) {
            setModal2(true);
            setModal1(false)
        }
        if (index === 3) {
            setModal2(false);
            setModal3(true)
        }
        if (index === 4) {
            setModal3(false);
            setModal4(true)
        }
    };
    const handleCreateForm = (name) =>{
        if(name === 'createWalletForm'){
            setModal4(false)
            setCreateWalletForm(true);
        }
        if(name === "keysForm"){
            setCreateWalletForm(false);
            setKeysForm(true);
        }
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered className="create-wallet-modal">


                {
                    modal1 ?
                        <>
                            <Modal.Header>
                                <p> About Persistence Wallet</p>
                            </Modal.Header>
                            <Modal.Body className="create-wallet-body">
                                <div className="info-box">

                                    <p>Please take a moment to read through this short introduction. It’s very important for
                                        your own security that you understand these warnings. Ignoring this step will highly
                                        increase the chances of your funds being lost or stolen, in which case we won’t be
                                        able to help you.</p>
                                </div>
                                <div className="buttons">
                                    <button className="button button-primary" onClick={() => handleNext(2)}>Next</button>
                                </div>
                            </Modal.Body>
                        </>

                        : null
                }
                {
                    modal2 ?
                        <>
                        <Modal.Header>
                            <p> About Persistence Wallet</p>
                        </Modal.Header>
                        <Modal.Body className="create-wallet-body">
                            <h3 className="question-heading">What is Persistence Wallet?</h3>
                            <div className="info-box">
                                <div className="question-mark-box">
                                    <span>?</span>
                                </div>
                                <p>Please take a moment to read through this short introduction. It’s very important for
                                    your own security that you understand these warnings. Ignoring this step will highly
                                    increase the chances of your funds being lost or stolen, in which case we won’t be
                                    able to help you.</p>
                            </div>
                            <div className="buttons">
                                <button className="button button-secondary" onClick={() => handlePrevious(1)}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                                <button className="button button-primary" onClick={() => handleNext(3)}>Next</button>
                            </div>

                        </Modal.Body>
                        </>
                        : null
                }
                {
                    modal3 ?
                        <>
                        <Modal.Header>
                            <p> About Persistence Wallet</p>
                        </Modal.Header>
                        <Modal.Body className="create-wallet-body">
                            <h3 className="question-heading">Why is Persistence Wallet?</h3>
                            <div className="info-box">
                                <div className="question-mark-box">
                                    <span>?</span>
                                </div>
                                <p>Please take a moment to read through this short introduction. It’s very important for
                                    your own security that you understand these warnings. Ignoring this step will highly
                                    increase the chances of your funds being lost or stolen.</p>
                            </div>
                            <div className="buttons">
                                <button className="button button-secondary" onClick={() => handlePrevious(2)}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                                <button className="button button-primary" onClick={() => handleNext(4)}>Next</button>
                            </div>

                        </Modal.Body>
                        </>
                        : null
                }
                {
                    modal4 ?
                        <>
                        <Modal.Header>
                            <p> About Persistence Wallet</p>
                        </Modal.Header>
                        <Modal.Body className="create-wallet-body">
                            <h3 className="question-heading">When is Persistence Wallet?</h3>
                            <div className="info-box">
                                <div className="question-mark-box">
                                    <span>?</span>
                                </div>
                                <p>Please take a moment to read through this short introduction. It’s very important for
                                    your own security that you understand these warnings. Ignoring this step will highly
                                    increase.</p>
                            </div>
                            <div className="buttons">
                                <button className="button button-secondary" onClick={() => handlePrevious(3)}>
                                    <Icon
                                        viewClass="arrow-right"
                                        icon="left-arrow"/>
                                </button>
                                <button className="button button-primary" onClick={() => handleCreateForm("createWalletForm")}>Get Started</button>
                            </div>

                        </Modal.Body>
                        </>
                        : null
                }

                {
                    createWalletForm ?
                        <>
                        <Modal.Body className="create-wallet-body create-wallet-form-body">
                            <h3 className="heading">Creating New Wallet</h3>
                            <p className="info">Already Have a wallet? <span>Import wallet</span></p>
                            <Form>
                                <p className="label">Your password</p>
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        name="amount"
                                        placeholder="Enter Your Wallet Password"
                                        required={true}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        name="amount"
                                        placeholder="Re-Enter Your Wallet Password"
                                        required={true}
                                    />
                                </Form.Group>
                                <div className="buttons">
                                    <button className="button button-primary" onClick={() => handleCreateForm("keysForm")}>Next</button>
                                </div>
                                <div className="note-section">
                                    <div className="exclamation"><Icon
                                        viewClass="arrow-right"
                                        icon="exclamation"/></div>
                                    <p>Your Password encrypts your private key. This does not act as a seed to generate your seed.</p>
                                </div>
                            </Form>

                        </Modal.Body>
                        </>
                        : null
                }
                {
                    keysForm ?
                        <Modal.Body className="create-wallet-body create-wallet-form-body">
                            <h3 className="heading">Creating New Wallet</h3>
                            <p className="info">Already Have a wallet? <span>Import wallet</span></p>
                            <div className="seed-section">
                                <h3 className="heading">Your Seed Phrase</h3>
                                <p className="menmonic">
                                    six man exhibit measure carpet sad can awkward movie magic network cereal gaze void spice abuse judge sea wheel ethics apple treat script tilt
                                </p>
                            </div>
                            <div className="buttons">
                                <button className="button button-primary" onClick={() => handleCreateForm("keysForm")}>Next</button>
                            </div>
                            <div className="note-section">
                                <div className="exclamation"><Icon
                                    viewClass="arrow-right"
                                    icon="exclamation"/></div>
                                <p>The Mnemonic is a list of 24 words used to access your wallet</p>
                            </div>
                        </Modal.Body>
                        : null
                }
            </Modal>

        </div>

    );
};
export default CreateWallet;
