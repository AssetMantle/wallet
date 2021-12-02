import React, {useEffect, useState} from "react";
import "../../utils/kepler";
import KeplerWallet from "../../utils/kepler";
import {NavLink, useHistory} from "react-router-dom";
import {Nav, Navbar} from "react-bootstrap";
import logo from "../../assets/images/logo_lite.svg";
import config from "../../config";
import {useTranslation} from "react-i18next";
import ModalKeplerInstall from "./ModalKeplerInstall";
import Icon from "../../components/Icon";
import transactions, {GetAccount} from "../../utils/transactions";
import * as Sentry from "@sentry/browser";

const KeplerHome = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState("");
    const [address, setAddress] = useState("");
    useEffect(() => {
        setErrorMessage("");
        const kepler = KeplerWallet();
        kepler.then(function () {
            const address = localStorage.getItem("keplerAddress");
            setAddress(address);
        }).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            setErrorMessage(error.message);
        });
    }, []);

    const handleKepler = () => {
        setErrorMessage("");
        const kepler = KeplerWallet();
        kepler.then(function () {
            const address = localStorage.getItem("keplerAddress");
            setAddress(address);
        }).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            setErrorMessage(error.message);
        });
    };

    const handleRoute = () => {
        const address = localStorage.getItem("keplerAddress");
        GetAccount(address)
            .then(async res => {
                const accountType = await transactions.VestingAccountCheck(res.typeUrl);
                if (accountType) {
                    localStorage.setItem('fee', config.vestingAccountFee);
                    localStorage.setItem('account', 'vesting');
                } else {
                    localStorage.setItem('fee', config.vestingAccountFee);
                    localStorage.setItem('account', 'non-vesting');
                }
            })
            .catch(error => {
                Sentry.captureException(error.response
                    ? error.response.data.message
                    : error.message);
                console.log(error.message);
                localStorage.setItem('fee', config.vestingAccountFee);
                localStorage.setItem('account', 'non-vesting');
            });
        localStorage.setItem('address', address);
        localStorage.setItem('loginToken', 'loggedIn');
        localStorage.setItem('version', config.version);
        localStorage.setItem('loginMode', 'kepler');
        history.push('/dashboard/wallet');
    };
    const handlePrevious = () => {
        history.push('/');
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
                            <li className="nav-item link">
                                <a className="nav-link primary-medium-color"
                                    href="https://notes.persistence.one/s/9l80_chis" rel="noopener noreferrer"
                                    target="_blank">
                                    {t("HELP")}
                                </a>
                            </li>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
            <div className="kepler-container">
                <div className="info">
                    <div className="header-info">
                        <div className="previous-section">
                            <button className="button" onClick={() => handlePrevious("keysForm")}>
                                <Icon
                                    viewClass="arrow-right"
                                    icon="left-arrow"/>
                            </button>
                        </div>
                        <h3>{t("USE_KEPLER_BROWSER_EXTENSION")}</h3>
                    </div>
                    <div className="info-body">
                        {errorMessage !== "" ?
                            <>
                                <div className="buttons">
                                    <button className="button button-primary"
                                        onClick={() => handleKepler()}>{t("CONNECT")}
                                    </button>
                                </div>
                                {
                                    errorMessage === "install keplr extension" ?
                                        <ModalKeplerInstall/>
                                        :
                                        <div className="text">
                                            <p>{t("KEPLER_ERROR")}</p>
                                            <p className="form-error">{errorMessage}</p>
                                        </div>
                                }

                            </>
                            :
                            <>

                                <p>{t("KEPLER_ACCOUNT_NOTE")}</p>
                                <div className="buttons-list">
                                    {
                                        address !== ""
                                            ?
                                            <p>{address}</p>
                                            : <p>Fetching Address..</p>

                                    }

                                    <button className="button button-primary" onClick={() => handleRoute()}>{t("USE")}
                                    </button>

                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
export default KeplerHome;
