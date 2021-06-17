import React, {useState, useEffect} from "react";
import {
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

    useEffect(() => {
        let ledgerResponse = fetchAddress();
        ledgerResponse.then(function (result) {
            setLedgerAddress(result);
        }).catch(err => {
            setErrorMessage(err.response
                ? err.response.data.message
                : err.message);
        });

    },[]);
    const handleClose = () => {
        setShow(false);
        props.handleClose();
    };
    const handleRoute = () => {
        if(ledgerAddress !== ''){
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
                                    <div className="buttons-list">
                                        <p>{ledgerAddress}</p>
                                        <button className="button button-primary" onClick={() => handleRoute()}>Continue
                                        </button>
                                    </div>
                                    :
                                    <p className="fetching">Fetching Address</p>

                            }

                        </>
                }


            </div>
        </Modal>
    );
};
export default LedgerLogin;
