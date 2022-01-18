import React, {useEffect, useState} from "react";
import "../../utils/keplr";
import KeplrWallet from "../../utils/keplr";
import {NavLink, useHistory} from "react-router-dom";
import {Nav, Navbar} from "react-bootstrap";
import logo from "../../assets/images/logo_lite.svg";
import config from "../../config";
import {useTranslation} from "react-i18next";
import ModalKeplrInstall from "./ModalKeplrInstall";
import Icon from "../../components/Icon";
import * as Sentry from "@sentry/browser";
import {ACCOUNT, ADDRESS, FEE, KEPLR_ADDRESS, LOGIN_MODE, LOGIN_TOKEN, VERSION} from "../../constants/localStorage";
import {vestingAccountCheck, getAccount} from "../../utils/helper";

const KeplrHome = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState("");
    const [address, setAddress] = useState("");
    useEffect(() => {
        setErrorMessage("");
        const keplr = KeplrWallet();
        keplr.then(function () {
            const address = localStorage.getItem(KEPLR_ADDRESS);
            setAddress(address);
        }).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            setErrorMessage(error.message);
        });
    }, []);

    const handleKeplr = () => {
        setErrorMessage("");
        const keplr = KeplrWallet();
        keplr.then(function () {
            const address = localStorage.getItem(KEPLR_ADDRESS);
            setAddress(address);
        }).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            setErrorMessage(error.message);
        });
    };

    const handleRoute = () => {
        const address = localStorage.getItem(KEPLR_ADDRESS);
        getAccount(address)
            .then(async res => {
                const accountType = await vestingAccountCheck(res.typeUrl);
                if (accountType) {
                    localStorage.setItem(FEE, config.vestingAccountFee);
                    localStorage.setItem(ACCOUNT, 'vesting');
                } else {
                    localStorage.setItem(FEE, config.vestingAccountFee);
                    localStorage.setItem(ACCOUNT, 'non-vesting');
                }
            })
            .catch(error => {
                Sentry.captureException(error.response
                    ? error.response.data.message
                    : error.message);
                console.log(error.message);
                localStorage.setItem(FEE, config.vestingAccountFee);
                localStorage.setItem(ACCOUNT, 'non-vesting');
            });
        localStorage.setItem(ADDRESS, address);
        localStorage.setItem(LOGIN_TOKEN, 'loggedIn');
        localStorage.setItem(VERSION, config.version);
        localStorage.setItem(LOGIN_MODE, 'keplr');
        history.push('/dashboard/wallet');
    };
    const handlePrevious = () => {
        history.push('/');
    };
    return (
        <div className="keplr-section">
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
            <div className="keplr-container">
                <div className="info">
                    <div className="header-info">
                        <div className="previous-section">
                            <button className="button" onClick={() => handlePrevious("keysForm")}>
                                <Icon
                                    viewClass="arrow-right"
                                    icon="left-arrow"/>
                            </button>
                        </div>
                        <h3>{t("USE_KEPLR_BROWSER_EXTENSION")}</h3>
                    </div>
                    <div className="info-body">
                        {errorMessage !== "" ?
                            <>
                                <div className="buttons">
                                    <button className="button button-primary"
                                        onClick={() => handleKeplr()}>{t("CONNECT")}
                                    </button>
                                </div>
                                {
                                    errorMessage === "install keplr extension" ?
                                        <ModalKeplrInstall/>
                                        :
                                        <div className="text">
                                            <p>{t("KEPLR_ERROR")}</p>
                                            <p className="form-error">{errorMessage}</p>
                                        </div>
                                }

                            </>
                            :
                            <>

                                <p>{t("KEPLR_ACCOUNT_NOTE")}</p>
                                <div className="buttons-list">
                                    {
                                        address !== ""
                                            ?
                                            <p>{address}</p>
                                            : <p>{t("FETCHING_ADDRESS")}..</p>

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
export default KeplrHome;
