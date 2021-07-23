import React, {useState, useEffect} from "react";
import {
    Form,
    Modal,
} from "react-bootstrap";
import Icon from "../../components/Icon";
import config from "../../config";
import {useTranslation} from "react-i18next";
import {fetchAddress} from "../../utils/ledger";
import {useHistory} from "react-router-dom";

const LedgerLogin = (props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [ledgerAddress, setLedgerAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [advancedMode, setAdvancedMode] = useState(false);

    useEffect(() => {
        let ledgerResponse = fetchAddress();
        ledgerResponse.then(function (result) {
            setLedgerAddress(result);
        }).catch(err => {
            setErrorMessage(err.response
                ? err.response.data.message
                : err.message);
        });

    }, []);
    const handleClose = () => {
        setShow(false);
        props.handleClose();
    };
    const handleRoute = () => {
        if (ledgerAddress !== '') {
            let accountNumber = 0;
            let addressIndex = 0;
            localStorage.setItem('accountNumber', accountNumber.toString());
            localStorage.setItem('addressIndex', addressIndex.toString());
            localStorage.setItem('loginToken', 'loggedIn');
            localStorage.setItem('address', ledgerAddress);
            localStorage.setItem('loginMode', 'ledger');
            localStorage.setItem('version', config.version);
            history.push('/dashboard/wallet');
        }
    };
    const handlePrevious = (formName) => {
        if (formName === "addressImport") {
            setShow(false);
            props.setShow(true);
            props.setWithLedger(false);
        }
    };
    const handleAdvanceMode = () => {
        setAdvancedMode(!advancedMode);
    };

    const handleKeypress = e => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let accountNumber = 0;
        let addressIndex = 0;
        if(advancedMode){
            accountNumber = document.getElementById('ledgerAccountNumber').value;
            addressIndex = document.getElementById('ledgerAccountIndex').value;
            if(accountNumber === ""){
                accountNumber = 0;
            }
            if(addressIndex === ""){
                addressIndex = 0;
            }
        }
        let ledgerResponse = fetchAddress(accountNumber, addressIndex);
        ledgerResponse.then(function (result) {
            setLedgerAddress(result);
            localStorage.setItem('accountNumber', accountNumber.toString());
            localStorage.setItem('addressIndex', addressIndex.toString());
        }).catch(err => {
            setErrorMessage(err.response
                ? err.response.data.message
                : err.message);
        });
    };
    return (
        <Modal backdrop="static" show={show} onHide={handleClose} centered className="create-wallet-modal seed">
            <Modal.Header closeButton>
                <div className="previous-section">
                    <button className="button" onClick={() => handlePrevious("addressImport")}>
                        <Icon
                            viewClass="arrow-right"
                            icon="left-arrow"/>
                    </button>
                </div>
                <h3 className="heading">{t("SIGN_IN")}</h3>
            </Modal.Header>
            <div className="create-wallet-body create-wallet-form-body">
                {
                    errorMessage !== "" ?
                        <p className="form-error">{errorMessage}</p>
                        :
                        <>
                            {
                                ledgerAddress !== ""
                                    ?
                                    <>
                                        <div className="buttons-list">
                                            <p>{ledgerAddress}</p>
                                            <button className="button button-primary" onClick={() => handleRoute()}>Continue
                                            </button>
                                        </div>
                                        <div className="select-gas">
                                            <p onClick={handleAdvanceMode}
                                                className="text-center">{!advancedMode ? "Advanced" : "Advanced"}
                                                {!advancedMode ?
                                                    <Icon
                                                        viewClass="arrow-right"
                                                        icon="down-arrow"/>
                                                    :
                                                    <Icon
                                                        viewClass="arrow-right"
                                                        icon="up-arrow"/>}
                                            </p>
                                        </div>
                                        {advancedMode
                                            ?
                                            <Form onSubmit={handleSubmit}>
                                                <div className="form-field">
                                                    <p className="label">{t("ACCOUNT")}</p>
                                                    <Form.Control
                                                        type="number"
                                                        min={0}
                                                        max={4294967295}
                                                        name="accountNumber"
                                                        id="ledgerAccountNumber"
                                                        onKeyPress={handleKeypress}
                                                        placeholder={t("ACCOUNT_NUMBER")}
                                                        required={false}
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <p className="label">{t("ACCOUNT_INDEX")}</p>
                                                    <Form.Control
                                                        type="number"
                                                        min={0}
                                                        max={4294967295}
                                                        name="accountIndex"
                                                        id="ledgerAccountIndex"
                                                        onKeyPress={handleKeypress}
                                                        placeholder={t("ACCOUNT_INDEX")}
                                                        required={false}
                                                    />
                                                </div>
                                                <div className="buttons">
                                                    <button className="button button-primary" type="submit">Submit
                                                    </button>
                                                </div>
                                            </Form>
                                            : ""
                                        }
                                    </>
                                    :
                                    <>
                                        <p className="fetching">Fetching Address</p>
                                    </>

                            }

                        </>
                }


            </div>
        </Modal>
    );
};
export default LedgerLogin;
