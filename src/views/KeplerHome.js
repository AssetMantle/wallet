import React, {useEffect, useState} from "react";
import "../utils/kepler";
import KeplerWallet from "../utils/kepler";
import {useHistory, NavLink} from "react-router-dom";
import {Nav, Navbar} from "react-bootstrap";
import logo from "../assets/images/logo_lite.svg";
import ModalFaq from "../containers/Faq";
import MakePersistence from "../utils/cosmosjsWrapper";
import config from "../config";
import {useTranslation} from "react-i18next";

const KeplerHome = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState("");
    const [showFaq, setShowFaq] = useState(false);
    const [address, setAddress] = useState("");
    useEffect(() => {
        const kepler = KeplerWallet();
        kepler.then(function (item) {
            const address = localStorage.getItem("keplerAddress");
            setAddress(address);
        }).catch(err => {
            setErrorMessage(err.message)
        });
    }, []);

    const handleKepler = () => {
        setErrorMessage("")
        const kepler = KeplerWallet();
        kepler.then(function (item) {
            const address = localStorage.getItem("keplerAddress");
            setAddress(address);
        }).catch(err => {
            setErrorMessage(err.message)
        });
    };

    const handleRoute = () => {
        const persistence = MakePersistence(0, 0);
        const address = localStorage.getItem("keplerAddress");
        persistence.getAccounts(address).then(data => {
            if (data.code === undefined) {
                if (data.account["@type"] === "/cosmos.vesting.v1beta1.PeriodicVestingAccount" ||
                    data.account["@type"] === "/cosmos.vesting.v1beta1.DelayedVestingAccount" ||
                    data.account["@type"] === "/cosmos.vesting.v1beta1.ContinuousVestingAccount") {
                    setErrorMessage("PeriodicVestingAccount is currently not supported with kepler, you can use " +
                        "browser extension to send tokens.")
                } else {
                    localStorage.setItem('address', address);
                    localStorage.setItem('loginToken', 'loggedIn');
                    localStorage.setItem('version', config.version);
                    localStorage.setItem('loginMode', 'kepler');
                    history.push('/dashboard/wallet');
                }
            } else {
                localStorage.setItem('address', address);
                localStorage.setItem('loginToken', 'loggedIn');
                localStorage.setItem('version', config.version);
                localStorage.setItem('loginMode', 'kepler');
                history.push('/dashboard/wallet');
            }
        }).catch(err => {
            setErrorMessage(err.message);
        })

    };

    const handleHelp = () => {
        setShowFaq(true)
    };

    return (
        <div className="kepler-section">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <div className="container">
                    <Navbar.Brand><NavLink to="/">
                        <img src={logo} alt="logo"/>
                    </NavLink></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto">
                            <a className="nav-link" href="https://persistence.one/" target="_blank"
                               rel="noopener noreferrer">{t("LEARN_MORE")}</a>
                            <p className="nav-link" onClick={handleHelp} target="_blank"
                               rel="noopener noreferrer">{t("HELP")}</p>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
            <div className="kepler-container">
                <div className="info">
                    <h3>{t("USE_KEPLER_BROWSER_EXTENSION")}</h3>
                    {errorMessage !== "" ?
                        <>
                            <div className="buttons">
                                <button className="button button-primary" onClick={() => handleKepler()}>{t("CONNECT")}
                                </button>
                            </div>
                            <div className="text">
                                <p>{t("KEPLER_ERROR")}</p>
                                <p className="form-error">{errorMessage}</p>
                            </div>
                        </>
                        :
                        <>

                            <p>{t("KEPLER_ACCOUNT_NOTE")}</p>
                            <div className="buttons-list">
                                <p>{address}</p>
                                <button className="button button-primary" onClick={() => handleRoute()}>{t("USE")}
                                </button>

                            </div>
                        </>
                    }
                </div>
            </div>
            {showFaq
                ?
                <ModalFaq setShowFaq={setShowFaq}/>
                :
                null}
        </div>
    )
};
export default KeplerHome;