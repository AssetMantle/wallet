import {Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import AddressImport from "../ImportWallet/AddressImport";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import LedgerLogin from "./LedgerLogin";

const SignIn = (props) => {
    const history = useHistory();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [withAddress, setWithAddress] = useState(false);
    const [withLedger, setWithLedger] = useState(false);
    const handleClose = () => {
        setShow(false);
        props.setRoutName("");
    };
    const handleRoute = async (key) => {
        if (key === "withAddress") {
            setWithAddress(true);
            setShow(false);
        }
        if (key === "ledger") {
            setShow(false);
            setWithLedger(true);
        }
    };

    const handleKepler = () => {
        history.push('/keplr');
    };

    return (
        <>
            <Modal backdrop="static" show={show} onHide={handleClose} centered
                className="create-wallet-modal seed">
                <>
                    <Modal.Header closeButton>
                        <h3 className="heading"> {t("SIGN_IN")}</h3>
                    </Modal.Header>
                    <Modal.Body className="create-wallet-body create-wallet-form-body sign-in-buttons">
                        <div className="buttons">
                            <button className="button button-primary large"
                                onClick={() => handleRoute("ledger")}>{t("USE_LEDGER")}
                            </button>
                        </div>
                        <div className="buttons">
                            <button className="button button-primary" onClick={() => handleKepler("kepler")}>{t("USE_KEPLER")}
                            </button>
                        </div>
                        <div className="buttons">
                            <button className="button button-primary large"
                                onClick={() => handleRoute("withAddress")}>{t("CONTINUE_WITH_ADDRESS")}
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
            {withLedger ?
                <LedgerLogin setWithLedger={setWithLedger} handleClose={handleClose} setShow={setShow}
                />
                : null
            }
        </>
    );
};


export default SignIn;
