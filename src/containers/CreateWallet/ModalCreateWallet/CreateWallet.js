import React, {useEffect, useState} from "react";
import {Form, Modal} from "react-bootstrap";
import Icon from "../../../components/Icon";
import wallet from "../../../utils/wallet";
import helper from "../../../utils/helper";
import {useHistory} from "react-router-dom";
import ImportWallet from "../../ImpotWallet";
import AdvanceMode from "./AdvanceMode";
const CreateWallet = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [showImportWallet, setShowImportWallet] = useState(false);
    const [mnemonicQuiz, setMnemonicQuiz] = useState(false);
    const [keysForm, setKeysForm] = useState(true);
    const [mnemonicList, setMnemonicList] = useState('');
    const [accountInfo, setAccountInfo] = useState(false);
    const [randomMnemonicList, setRandomMnemonicList] = useState([]);
    const [randomNumberList, setRandomNumberList] = useState([]);
    const [quizError, setQuizError] = useState(false);
    const [response, setResponse] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleClose = () => {
        setShow(false);
        props.handleClose();
    };
    useEffect(() => {
        const responseData = wallet.createRandomWallet();
        setResponse(responseData);
        let mnemonic = responseData.mnemonic;
        const mnemonicArray = mnemonic.split(' ');
        setMnemonicList(mnemonicArray);
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
        if (responseData.error) {
                setErrorMessage(responseData.error);
        }
    },[]);
    const handleCreateForm = (name) => {
        if (name === "keysForm") {
            setKeysForm(false);
            setMnemonicQuiz(true)
        }
    };

    const handleSubmitMnemonic = () => {
        randomNumberList.map((number, index) => {
            let phrase = document.getElementById('mnemonicKey' + number).value;
            if (mnemonicList[number] !== phrase) {
                setQuizError(true);
            } else {
                if(index === randomNumberList.length-1){
                    localStorage.setItem('loginToken', 'loggedIn');
                    localStorage.setItem('address', response.address);
                    setAccountInfo(true);
                    setMnemonicQuiz(false);
                }
            }
        })

    };

    const handleRoute = () => {
        setShow(false);
        setShowImportWallet(true)
    };
    return (
        <div>
            <Modal backdrop="static" show={show} onHide={handleClose} centered className="create-wallet-modal large seed">
                <Modal.Header closeButton>
                    <h3 className="heading">Creating New Wallet</h3>
                </Modal.Header>
                {
                    keysForm ?
                        <div className="create-wallet-body create-wallet-form-body">

                            <p className="info">Already Have a wallet? <span onClick={handleRoute}>Import wallet</span>
                            </p>
                            <div className="seed-section">
                                <h3 className="heading">Mnemonic (Seed Phrase)</h3>
                                <div className="menmonic-list">
                                    {mnemonicList ?
                                        mnemonicList.map((key, index) => {
                                        return (
                                            <Form.Control
                                                disabled
                                                key={index}
                                                type="text"
                                                value={key}
                                                required={true}
                                            />
                                        )
                                    }): null
                                    }
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
                        </div>
                        : null
                }
                {
                    mnemonicQuiz ?
                        <div className="create-wallet-body create-wallet-form-body">
                            <p className="info">Already Have a wallet? <span onClick={handleRoute}>Import wallet</span>
                            </p>
                            <div className="seed-section">
                                <h3 className="heading">Mnemonic (Seed Phrase)</h3>
                                <div className="menmonic-list">
                                    {randomMnemonicList.map((key, index) => {
                                        if (key !== '') {
                                            return (
                                                <Form.Control
                                                    disabled
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
                                <p className="form-error">Mnemonic not matched</p>
                                : null}
                            <div className="buttons">
                                <button className="button button-primary" onClick={() => handleSubmitMnemonic()}>Submit
                                </button>
                            </div>
                            <div className="note-section">
                                <div className="exclamation"><Icon
                                    viewClass="arrow-right"
                                    icon="exclamation"/></div>
                                <p>Note and store the mnemonic for future use</p>
                            </div>
                        </div>
                        : null
                }
                {accountInfo ?
                    <div className="create-wallet-body create-wallet-form-body">
                        <p className="info">Already Have a wallet? <span onClick={handleRoute}>Import wallet</span>
                        </p>
                        <AdvanceMode mnemonic={response.mnemonic}/>
                    </div>
                : null}
            </Modal>
                {showImportWallet ?
                    <ImportWallet setShowImportWallet={setShowImportWallet} name="createWallet" handleClose={handleClose}/>
                    : null
                }
            </div>
    );
};
export default CreateWallet;
