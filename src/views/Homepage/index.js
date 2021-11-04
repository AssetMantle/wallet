import React, {useState} from "react";
import {Nav, Navbar, NavLink} from "react-bootstrap";
import logo from "../../assets/images/logo_bold.svg";
import dark_icon from "../../assets/images/dark_icon.svg";
import ModalCreateWallet from "../../containers/CreateWallet/ModalCreateWallet";
import Footer from "../../components/Footer";
import SignIn from "../../containers/SignIn";
import {useTranslation} from "react-i18next";
import GenerateKeyStore from "../../containers/KeyStore/GenerateKeyStore";

const Homepage = () => {
    const {t} = useTranslation();
    const [routName, setRoutName] = useState("false");
    const handleRoute = (name) => {
        setRoutName(name);
    };

    return (
        <div className="home-page">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <div className="container">
                    <Navbar.Brand><Nav.Link>
                        <img src={logo} alt="logo"/>
                    </Nav.Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto">
                            <NavLink className="nav-link" onClick={() => handleRoute('signIn')} target="_blank"
                                rel="noopener noreferrer">{t("SIGN_IN")}</NavLink>
                            <a className="nav-link" href="https://persistence.one/" target="_blank"
                                rel="noopener noreferrer">  {t("LEARN_MORE")}</a>
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
            <div className="home-page-body">
                <div className="content">
                    <h3 className="heading">
                        {t("HOME_PAGE_TEXT")}
                    </h3>
                    <p className="sub-text">{t("HOME_PAGE_SUB_TEXT")}</p>
                    <div className="buttons">
                        <button className="button button-primary" onClick={() => handleRoute('createWallet')}>
                            {t("CREATE_WALLET")}
                        </button>
                        <p onClick={() => handleRoute('importWallet')} className="import">{t("GENERATE_KEY_STORE")}
                        </p>
                    </div>
                    <p className="border-logo"><img src={dark_icon} alt="dark-icon"/></p>
                </div>

            </div>
            <Footer/>
            {
                routName === "createWallet" ?
                    <ModalCreateWallet setRoutName={setRoutName}/>
                    : null
            }
            {
                routName === "importWallet" ?
                    <GenerateKeyStore setShowKeyStore={setRoutName} className={""}/>
                    : null
            }
            {
                routName === "signIn" ?
                    <SignIn setRoutName={setRoutName} name="homepage"/>
                    : null
            }
        </div>


    );
};
export default Homepage;