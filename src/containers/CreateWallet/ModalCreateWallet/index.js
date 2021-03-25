import React, {useState} from "react";
import {Modal} from "react-bootstrap";
import Icon from "../../../components/Icon";
import {useHistory} from "react-router-dom";
import CreateWallet from "./CreateWallet";

const ModalCreateWallet = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [createWallet, setCreatWallet] = useState(false);
    const [modal1, setModal1] = useState(true);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const [modal4, setModal4] = useState(false);
    const handleClose = () => {
        setShow(false);
        props.setRoutName("")
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
    const handleCreateForm = (name) => {
        if (name === 'createWalletForm') {
            setModal1(false);
            setShow(false);
            setCreatWallet(true);
        }
    };

    return (
        <div>
            {show ?
                <Modal show={show} onHide={handleClose} centered className="create-wallet-modal">
                    {
                        modal1 ?
                            <>
                                <Modal.Header className="info-modal-header" closeButton>
                                    <p> About Persistence Wallet</p>
                                </Modal.Header>
                                <Modal.Body className="create-wallet-body">
                                    <div className="info-box">
                                        <p><b>Take a moment to read through this content for your own safety
                                        </b></p>
                                        <ul>
                                            <li>Users need to securely store their Mnemonic (seed phrase) to prevent
                                                loss of funds. Losing or exposing this phrase could potentially lead to
                                                users' funds being stolen.
                                            </li>
                                            <li>Users can view and save their mnemonic while creating a wallet.
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="buttons">
                                        <button className="button button-primary"
                                                onClick={() => handleCreateForm("createWalletForm")}>Next
                                        </button>
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
                                        <p>Please take a moment to read through this short introduction. It’s very
                                            important
                                            for
                                            your own security that you understand these warnings. Ignoring this step
                                            will
                                            highly
                                            increase the chances of your funds being lost or stolen, in which case we
                                            won’t
                                            be
                                            able to help you.</p>
                                    </div>
                                    <div className="buttons">
                                        <button className="button button-secondary" onClick={() => handlePrevious(1)}>
                                            <Icon
                                                viewClass="arrow-right"
                                                icon="left-arrow"/>
                                        </button>
                                        <button className="button button-primary" onClick={() => handleNext(3)}>Next
                                        </button>
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
                                        <p>Please take a moment to read through this short introduction. It’s very
                                            important
                                            for
                                            your own security that you understand these warnings. Ignoring this step
                                            will
                                            highly
                                            increase the chances of your funds being lost or stolen.</p>
                                    </div>
                                    <div className="buttons">
                                        <button className="button button-secondary" onClick={() => handlePrevious(2)}>
                                            <Icon
                                                viewClass="arrow-right"
                                                icon="left-arrow"/>
                                        </button>
                                        <button className="button button-primary" onClick={() => handleNext(4)}>Next
                                        </button>
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
                                        <p>Please take a moment to read through this short introduction. It’s very
                                            important
                                            for
                                            your own security that you understand these warnings. Ignoring this step
                                            will
                                            highly
                                            increase.</p>
                                    </div>
                                    <div className="buttons">
                                        <button className="button button-secondary" onClick={() => handlePrevious(3)}>
                                            <Icon
                                                viewClass="arrow-right"
                                                icon="left-arrow"/>
                                        </button>
                                        <button className="button button-primary"
                                                onClick={() => handleCreateForm("createWalletForm")}>Get Started
                                        </button>
                                    </div>

                                </Modal.Body>
                            </>
                            : null
                    }
                </Modal>
                : null
            }
            {
                createWallet ?
                    <CreateWallet handleClose={handleClose} setShow={setShow} setModal1={setModal1}
                                  setCreatWallet={setCreatWallet}/>
                    :
                    null
            }
        </div>

    );
};
export default ModalCreateWallet;
