import React, {useState} from "react";
import {Navbar, NavLink, Nav} from "react-bootstrap";
import logo from "../../assets/images/logo_bold.svg";
import dark_icon from "../../assets/images/dark_icon.svg";
import ModalCreateWallet from "../../containers/CreateWallet/ModalCreateWallet";
import ModalFaq from "../../containers/Faq";
import ModalImportWallet from "../../containers/ImpotWallet";
import Footer from "../../components/Footer";
import SignIn from "../../containers/SignIn";
import {useTranslation} from "react-i18next";

const Homepage = () => {
    const {t} = useTranslation();
    const [routName, setRoutName] = useState("false");
    const [showFaq, setShowFaq] = useState(false);
    const handleRoute = (name) => {
        setRoutName(name);
    };
    const handleHelp = () => {
        setShowFaq(true)
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
                            <Nav.Link className="nav-link" onClick={handleHelp} target="_blank"
                                      rel="noopener noreferrer">{t("HELP")}</Nav.Link>
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
                        <p onClick={() => handleRoute('importWallet')} className="import">{t("IMPORT_EXISTS_WALLET")}
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
                    <ModalImportWallet setRoutName={setRoutName} name="homepage"/>
                    : null
            }
            {
                routName === "signIn" ?
                    <SignIn setRoutName={setRoutName} name="homepage"/>
                    : null
            }
            {showFaq
                ?
                <ModalFaq setShowFaq={setShowFaq}/>
                :
                null}
        </div>


    )
};
export default Homepage;