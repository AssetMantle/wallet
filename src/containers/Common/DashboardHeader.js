import React, {useState} from "react";
import Icon from "../../components/Icon";
import {NavLink, useHistory} from 'react-router-dom';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import ReactQRCode from "qrcode.react";
import Copy from "../../components/Copy";
import ModalFaq from "../Faq";
import helper from "../../utils/helper";
import logo from "../../assets/images/logo_lite.svg";
import config from "../../utils/config";

const DashboardHeader = (props) => {
    const history = useHistory();
    const [showFaq, setShowFaq] = useState(false);
    const address = localStorage.getItem('address');
    let addressTruncate = helper.stringTruncate(address);
    const handleHelp = () => {
        setShowFaq(true)
    };
    const closeWallet = () => {
        localStorage.setItem('loginToken', '');
        localStorage.setItem('address', '');
        localStorage.setItem('loginMode', '');
        history.push('/');
        window.location.reload();
    };
    const ProfileIcon = <Icon viewClass="profile" icon="profile"/>
    return (
        <div className="header">
            <Navbar collapseOnSelect expand="lg">
                <div className="container">
                    <Navbar.Brand><Nav.Link href="/">
                        <img src={logo} alt="logo"/>
                    </Nav.Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto">
                            <li className="nav-item link">
                                <NavLink className="nav-link primary-medium-color"
                                         to="/dashboard/wallet">
                                    <div className="icon-box">
                                        <Icon
                                            viewClass="icon"
                                            icon="wallet"
                                        />
                                    </div>
                                    Wallet
                                </NavLink>
                            </li>
                            <li className="nav-item link">
                                <NavLink className="nav-link primary-medium-color"
                                         to="/dashboard/staking">
                                    <div className="icon-box">
                                        <Icon
                                            viewClass="icon"
                                            icon="staking"/>
                                    </div>
                                    Staking
                                </NavLink>
                            </li>
                            <li className="nav-item link">
                                <a className="nav-link primary-medium-color" href={config.explorerUrl}
                                   rel="noopener noreferrer" target="_blank">
                                    <div className="icon-box">
                                        <Icon
                                            viewClass="icon"
                                            icon="explorer"/>
                                    </div>
                                    Explorer
                                </a>
                            </li>
                            <li className="nav-item link">
                                <a className="nav-link primary-medium-color"
                                   onClick={handleHelp}>
                                    <div className="icon-box">
                                        <Icon
                                            viewClass="icon"
                                            icon="help"/>
                                    </div>
                                    Help
                                </a>
                            </li>
                            <li className="profile-section">
                                <NavDropdown title={ProfileIcon} id="basic-nav-dropdown" className="profile-dropdown">
                                    <div className="info">
                                        <div className="qr-box">
                                            <ReactQRCode value="persistence1095fgex3h37zl4yjptnsd7qfmspesvav7xhgwt"/>
                                        </div>

                                        <p className="key">Wallet Address</p>
                                        <div className="address"><span>{addressTruncate}</span> <Copy id={address}/>
                                        </div>
                                    </div>
                                    <div className="dropdown-footer">
                                        <p onClick={closeWallet} className="link-close">Close Wallet</p>
                                        {/*<p>Account</p>*/}
                                    </div>
                                </NavDropdown>
                            </li>


                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
            {showFaq
                ?
                <ModalFaq setShowFaq={setShowFaq}/>
                :
                null}
        </div>
    );
};
export default DashboardHeader;