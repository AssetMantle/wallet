import React, {useState, useEffect} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import Icon from "../../components/Icon";
import DownloadLink from "react-download-link";
import wallet from "../../utils/wallet";
import helper from "../../utils/helper";

const CreateWallet = (props) => {
    const [show, setShow] = useState(true);
    const [showLargeModal, setShowLargeModal] = useState(false);
    const [modal1, setModal1] = useState(true);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const [modal4, setModal4] = useState(false);
    const [mnemonicQuiz, setMnemonicQuiz] = useState(false);
    const [createWalletForm, setCreateWalletForm] = useState(false);
    const [keysForm, setKeysForm] = useState(false);
    const [mnemonicList, setMnemonicList] = useState('');
    const [randomMnemonicList, setRandomMnemonicList] = useState([]);
    const [randomNumberList, setRandomNumberList] = useState([]);
    const [quizError, setQuizError] = useState(false);
    const [response, setResponse] = useState("");
    const [jsonName, setJsonName] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
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
            setModal4(false);
            setShow(false);
            setShowLargeModal(true);
            setCreateWalletForm(true);
        }
        if (name === "keysForm") {
            setKeysForm(false);
            setMnemonicQuiz(true)
        }
    };
    const handlePasswordChange = (evt) => {
        let password = document.getElementById('passwordIntial').value;

        if (evt.target.value !== password) {
            document.getElementById('passwordFinal').classList.add('not-matched')
        } else {
            if (document.getElementById('passwordFinal').classList.contains('not-matched')) {
                document.getElementById('passwordFinal').classList.remove('not-matched');
            }
        }
    };
    const handleSubmit = async event => {
        event.preventDefault();
        setCreateWalletForm(false);
        setKeysForm(true);
        let password = event.target.password.value;
        let confirmPassword = event.target.repassword.value;
        if (password === confirmPassword) {
            const responseData = wallet.createRandomWallet();
            let mnemonic = responseData.mnemonic;
            const mnemonicArray = mnemonic.split(' ');
            setMnemonicList(mnemonicArray);
            let encryptedData = helper.createStore(mnemonic, password)
            const jsonContent = JSON.stringify(encryptedData);
            setJsonName(jsonContent);
            let randomNumbers = helper.randomNum(1, 24);
            setRandomNumberList(randomNumbers);
            let newMnemonicList = [];
            mnemonicArray.map((key, index) => {
                if (randomNumbers.includes(index)) {
                    newMnemonicList.push('');
                } else {
                    newMnemonicList.push(key);
                }
            });
            setRandomMnemonicList(newMnemonicList);
            console.log(randomNumbers, newMnemonicList, "event.target.value");
            if (responseData.error) {
                setErrorMessage(responseData.error);
            }
        }

    };
    const handleSubmitMnemonic = () => {
        randomNumberList.map((number, index) => {

            let phrase = document.getElementById('mnemonicKey' + number).value;
            console.log(phrase, mnemonicList[number]);
            if (mnemonicList[number] === phrase) {
                console.log("success")
            }else
            {
                setQuizError(true);
            }
        })

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

                                    <p>Please take a moment to read through this short introduction. It’s very important
                                        for
                                        your own security that you understand these warnings. Ignoring this step will
                                        highly
                                        increase the chances of your funds being lost or stolen, in which case we won’t
                                        be
                                        able to help you.</p>
                                </div>
                                <div className="buttons">
                                    <button className="button button-primary" onClick={() => handleNext(2)}>Next
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
                                    <p>Please take a moment to read through this short introduction. It’s very important
                                        for
                                        your own security that you understand these warnings. Ignoring this step will
                                        highly
                                        increase the chances of your funds being lost or stolen, in which case we won’t
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
                                    <p>Please take a moment to read through this short introduction. It’s very important
                                        for
                                        your own security that you understand these warnings. Ignoring this step will
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
                                    <p>Please take a moment to read through this short introduction. It’s very important
                                        for
                                        your own security that you understand these warnings. Ignoring this step will
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
            <Modal show={showLargeModal} size="lg" onHide={handleClose} centered className="create-wallet-modal large">
                {
                    createWalletForm ?
                        <>
                            <Modal.Body className="create-wallet-body create-wallet-form-body">
                                <h3 className="heading">Creating New Wallet</h3>
                                <p className="info">Already Have a wallet? <span>Import wallet</span></p>
                                <Form onSubmit={handleSubmit}>
                                    <p className="label">Your password</p>
                                    <Form.Group>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            id="passwordIntial"
                                            placeholder="Enter Your Wallet Password"
                                            required={true}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control
                                            type="password"
                                            name="repassword"
                                            id="passwordFinal"
                                            onChange={handlePasswordChange}
                                            placeholder="Re-Enter Your Wallet Password"
                                            required={true}
                                        />
                                    </Form.Group>
                                    <div className="buttons">
                                        <button className="button button-primary">Next</button>
                                    </div>
                                    <div className="note-section">
                                        <div className="exclamation"><Icon
                                            viewClass="arrow-right"
                                            icon="exclamation"/></div>
                                        <p>Your Password encrypts your private key. This does not act as a seed to
                                            generate your seed.</p>
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
                                <h3 className="heading">Mnemonic (Seed Phrase)</h3>
                                <div className="menmonic-list">
                                    {mnemonicList.map((key, index) => {
                                        return (
                                            <Form.Control
                                                key={index}
                                                type="text"
                                                value={key}
                                                required={true}
                                            />
                                        )
                                    })
                                    }
                                </div>
                                <div className="download-section">
                                    <p className="name">Private Key:</p>
                                    <div className="key-download">
                                        <DownloadLink
                                            label="Download Key File for future use"
                                            filename="key.json"
                                            exportFile={() => `${jsonName}`}
                                        />
                                        <Icon viewClass="arrow-icon" icon="left-arrow"/>
                                    </div>
                                </div>

                            </div>
                            <div className="buttons">
                                <button className="button button-primary"
                                        onClick={() => handleCreateForm("keysForm")}>Next
                                </button>
                            </div>
                            <div className="note-section">
                                <div className="exclamation"><Icon
                                    viewClass="arrow-right"
                                    icon="exclamation"/></div>
                                <p>Please securely store the mnemonic for future use</p>
                            </div>
                        </Modal.Body>
                        : null
                }
                {
                    mnemonicQuiz ?
                        <Modal.Body className="create-wallet-body create-wallet-form-body">
                            <h3 className="heading">Creating New Wallet</h3>
                            <p className="info">Already Have a wallet? <span>Import wallet</span></p>
                            <div className="seed-section">
                                <h3 className="heading">Mnemonic (Seed Phrase)</h3>
                                <div className="menmonic-list">
                                    {randomMnemonicList.map((key, index) => {
                                        if (key !== '') {
                                            return (
                                                <Form.Control
                                                    key={index}
                                                    type="text"
                                                    id={`mnemonicKey${index}`}
                                                    value={key}
                                                    required={true}
                                                />
                                            )
                                        } else {
                                            return (
                                                <Form.Control
                                                    key={index}
                                                    className="empty-mnemonic"
                                                    type="text"
                                                    id={`mnemonicKey${index}`}
                                                    defaultValue={key}
                                                    required={true}
                                                />
                                            )
                                        }
                                    })
                                    }
                                </div>
                            </div>
                            {quizError ?
                                <p className="quiz-error">keys not matched</p>
                            : null}
                            <div className="buttons">
                                <button className="button button-primary" onClick={() => handleSubmitMnemonic()}>Next
                                </button>
                            </div>
                            <div className="note-section">
                                <div className="exclamation"><Icon
                                    viewClass="arrow-right"
                                    icon="exclamation"/></div>
                                <p>Please securely store the mnemonic for future use</p>
                            </div>
                        </Modal.Body>
                        : null
                }
            </Modal>

        </div>

    );
};
export default CreateWallet;
