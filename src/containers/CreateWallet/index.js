import React, {useState} from "react";
import {Form} from "react-bootstrap";
import Icon from "../../components/Icon";
import DownloadLink from "react-download-link";
import wallet from "../../utils/wallet";
import helper from "../../utils/helper";
import {useHistory} from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import open_eye from "../../assets/images/open_eye.svg";
import ImportWallet from "../ImpotWallet";
import HomepageHeader from "../Common/HomepageHeader";

const CreateWallet = () => {
    const history = useHistory();
    const [fieldType, setFieldType] = useState("password");
    const [showImportWallet, setShowImportWallet] = useState(false);
    const [visibleInitialPassword, setVisibleInitialPassword] = useState(false);
    const [finalPasswordFieldType, setFinalPasswordFieldType] = useState("password");
    const [visibleFinalPassword, setVisibleFinalPassword] = useState(false);
    const [mnemonicQuiz, setMnemonicQuiz] = useState(false);
    const [createWalletForm, setCreateWalletForm] = useState(true);
    const [keysForm, setKeysForm] = useState(false);
    const [mnemonicList, setMnemonicList] = useState('');
    const [randomMnemonicList, setRandomMnemonicList] = useState([]);
    const [randomNumberList, setRandomNumberList] = useState([]);
    const [quizError, setQuizError] = useState(false);
    const [response, setResponse] = useState("");
    const [jsonName, setJsonName] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const handleCreateForm = (name) => {
        if (name === 'createWalletForm') {
            setCreateWalletForm(true);
        }
        if (name === "keysForm") {
            setKeysForm(false);
            setMnemonicQuiz(true)
        }
    };
    const handlePasswordChange = (evt) => {
        let password = document.getElementById('passwordInitial').value;
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
        let password = event.target.password.value;
        let confirmPassword = event.target.repassword.value;
        if (password === confirmPassword) {
            setCreateWalletForm(false);
            setKeysForm(true);
            const responseData = wallet.createRandomWallet();
            setResponse(responseData);
            let mnemonic = responseData.mnemonic;
            const mnemonicArray = mnemonic.split(' ');
            setMnemonicList(mnemonicArray);
            let encryptedData = helper.createStore(mnemonic, password);
            const jsonContent = JSON.stringify(encryptedData.Response);
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
            if (responseData.error) {
                setErrorMessage(responseData.error);
            }
        } else {

        }

    };
    const handleSubmitMnemonic = () => {
        randomNumberList.map((number, index) => {
            let phrase = document.getElementById('mnemonicKey' + number).value;
            if (mnemonicList[number] === phrase) {
                localStorage.setItem('loginToken', 'loggedIn');
                localStorage.setItem('address', response.address);
                history.push('/dashboard/wallet');
            } else {
                setQuizError(true);
            }
        })

    };
    const handleShowPassword = () => {
        setVisibleInitialPassword(!visibleInitialPassword);
        setFieldType(fieldType === 'password' ? 'input' : 'password');
    };
    const handleShowFinalPassword = () => {
        setVisibleFinalPassword(!visibleFinalPassword);
        setFinalPasswordFieldType(finalPasswordFieldType === 'password' ? 'input' : 'password')
    };
    const handleRoute = () => {
        history.push('/import_wallet')
    };
    return (
        <div className="create-wallet-section">
            <HomepageHeader/>
            <div className="create-wallet-modal large">
                {
                    createWalletForm ?
                        <>
                            <div className="create-wallet-body create-wallet-form-body">
                                <h3 className="heading">Creating New Wallet</h3>
                                <p className="info">Already Have a wallet? <span
                                    onClick={handleRoute}>Import wallet</span></p>
                                <Form onSubmit={handleSubmit}>
                                    <p className="label">Your password</p>
                                    <Form.Group className="password-group">
                                        <Form.Control
                                            type={fieldType}
                                            name="password"
                                            id="passwordInitial"
                                            placeholder="Enter Your Wallet Password"
                                            required={true}
                                        />
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            edge="end"
                                            onClick={() => handleShowPassword()}>
                                            {visibleInitialPassword ? <img src={open_eye} alt="open_eye"/> :
                                                <img src={open_eye} alt="close_eye"/>}
                                        </IconButton>
                                    </Form.Group>
                                    <Form.Group className="password-group">
                                        <Form.Control
                                            type={finalPasswordFieldType}
                                            name="repassword"
                                            id="passwordFinal"
                                            onChange={handlePasswordChange}
                                            placeholder="Re-Enter Your Wallet Password"
                                            required={true}
                                        />
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            edge="end"
                                            onClick={() => handleShowFinalPassword()}>
                                            {visibleFinalPassword ? <img src={open_eye} alt="open_eye"/> :
                                                <img src={open_eye} alt="close_eye"/>}
                                        </IconButton>
                                    </Form.Group>
                                    {errorMessage !== "" ?
                                        <p>errorMessage</p>
                                        : null}
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

                            </div>
                        </>
                        : null
                }
                {
                    keysForm ?
                        <div className="create-wallet-body create-wallet-form-body">
                            <h3 className="heading">Creating New Wallet</h3>
                            <p className="info">Already Have a wallet? <span onClick={handleRoute}>Import wallet</span>
                            </p>
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
                        </div>
                        : null
                }
                {
                    mnemonicQuiz ?
                        <div className="create-wallet-body create-wallet-form-body">
                            <h3 className="heading">Creating New Wallet</h3>
                            <p className="info">Already Have a wallet? <span onClick={handleRoute}>Import wallet</span>
                            </p>
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
                                <p className="form-error">Mnemonic not matched</p>
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
                        </div>
                        : null
                }
                {showImportWallet ?
                    <ImportWallet setShowImportWallet={setShowImportWallet}/>
                    : null
                }
            </div>
        </div>
    );
};
export default CreateWallet;
