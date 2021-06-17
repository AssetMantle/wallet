import React, {useState, useEffect} from "react";
import {
    Modal,
} from "react-bootstrap";
import Icon from "../../components/Icon";
// import {useHistory} from "react-router-dom";
// import config from "../../config";
// import MakePersistence from "../../utils/cosmosjsWrapper";
// import helper from "../../utils/helper";
import config from "../../config";
import {useTranslation} from "react-i18next";
import {fetchAddress} from "../../utils/ledger";
const LedgerLogin = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [ledgerAddress, setLedgerAddress] = useState('');
    useEffect(() => {
        let ledgerResponse = fetchAddress();
        ledgerResponse.then(function (result) {
            console.log(result, "address");
            setLedgerAddress(result);
        }).catch(err => {
            console.log(err.response
                ? err.response.data.message
                : err.message, "let se");
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
            localStorage.setItem('loginMode', 'normal');
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
                    ledgerAddress !== ""
                        ?
                        <p>{ledgerAddress}</p>
                        : <p>Fetching Address..</p>

                }
                <button className="button button-primary" onClick={() => handleRoute()}>Continue
                </button>
            </div>
        </Modal>
    );
};
export default LedgerLogin;
