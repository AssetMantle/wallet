import React, {useState,useEffect} from "react";
import Icon from "../../components/Icon";
import {NavLink, useHistory} from 'react-router-dom';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import ReactQRCode from "qrcode.react";
import Copy from "../../components/Copy";
import helper from "../../utils/helper";
import {useTranslation} from "react-i18next";
import Darktheme from "../DarkTheme";
import GenerateKeyStore from "../KeyStore/GenerateKeyStore";
import MobileSidebar from "./MobileSidebar";
import transactions from "../../utils/transactions";
import config from "../../config";
const EXPLORER_API = process.env.REACT_APP_EXPLORER_API;

const DashboardHeader = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [showKeyStore, setShowKeyStore] = useState(false);
    const address = localStorage.getItem('address');
    let addressTruncate;
    if (address !== null) {
        addressTruncate = helper.stringTruncate(address);
    }
    useEffect(() => {
        const localTheme = window.localStorage.getItem('theme');
        if(localTheme === 'light'){
            if (document.getElementById('root').classList.contains('dark-mode')) {
                document.getElementById('root').classList.add('light-mode');
                document.getElementById('root').classList.remove('dark-mode');
            }
        }
        else{
            if (document.getElementById('root').classList.contains('light-mode')) {
                document.getElementById('root').classList.add('dark-mode');
                document.getElementById('root').classList.remove('light-mode');
            }
        }

    }, []);
    const closeWallet = () => {
        localStorage.clear();
        history.push('/');
        window.location.reload();
    };
    const handleKeyStore = () =>{
        setShowKeyStore(true);
    };
    const ledgerShowAddress = async () =>{
        const accountNumber= localStorage.getItem('accountNumber');
        const addressIndex = localStorage.getItem('addressIndex');
        const [wallet] = await transactions.LedgerWallet(transactions.makeHdPath(accountNumber, addressIndex), config.addressPrefix);
        await wallet.showAddress(transactions.makeHdPath(accountNumber, addressIndex));
    };
    const ProfileIcon = <Icon viewClass="profile" icon="profile"/>;
    return (
        <div className="header dashboard">
            <Navbar collapseOnSelect expand="lg">
                <div className="container">
                    <div className="nav-menu-icon">
                        <MobileSidebar/>
                    </div>
                    <Navbar.Brand>
                        <NavLink to="/dashboard/wallet" className="header-logo">
                            {/*<img src={theme === 'light' ? logo : logoDark} alt="logo"/>*/}
                        </NavLink>
                    </Navbar.Brand>

                    <Nav className="ml-auto">
                        <li className="nav-item link mobile-nav-item">
                            <NavLink className="nav-link primary-medium-color"
                                to="/dashboard/wallet">
                                <div className="icon-box">
                                    <Icon
                                        viewClass="icon"
                                        icon="wallet"
                                    />
                                </div>
                                {t("WALLET")}
                            </NavLink>
                        </li>
                        <li className="nav-item link mobile-nav-item">
                            <NavLink className="nav-link primary-medium-color"
                                to="/dashboard/staking">
                                <div className="icon-box">
                                    <Icon
                                        viewClass="icon"
                                        icon="staking"/>
                                </div>
                                {t("STAKING")}
                            </NavLink>
                        </li>
                        <li className="nav-item link mobile-nav-item">
                            <a className="nav-link primary-medium-color" href={EXPLORER_API}
                                rel="noopener noreferrer" target="_blank">
                                <div className="icon-box">
                                    <Icon
                                        viewClass="icon"
                                        icon="explorer"/>
                                </div>
                                {t("EXPLORER")}
                                <div className="icon-box">
                                    <Icon
                                        viewClass="icon"
                                        icon="export"/>
                                </div>
                            </a>
                        </li>
                        <li className="nav-item link mobile-nav-item">
                            <a className="nav-link primary-medium-color"
                                href="https://notes.persistence.one/s/9l80_chis" rel="noopener noreferrer" target="_blank">
                                <div className="icon-box">
                                    <Icon
                                        viewClass="icon"
                                        icon="help"/>
                                </div>
                                {t("HELP")}
                            </a>
                        </li>
                        <li className="profile-section">
                            <NavDropdown title={ProfileIcon} id="basic-nav-dropdown" className="profile-dropdown">
                                <div className="info">
                                    <div className="qr-box">
                                        <ReactQRCode value={address}/>
                                    </div>

                                    <p className="key"> {t("WALLET_ADDRESS")}
                                        {
                                            localStorage.getItem('loginMode') === 'ledger' ?
                                                <button className="ledger-verify" onClick={ledgerShowAddress}>Verify</button>
                                                : ""
                                        }</p>
                                    <div className="address"><span>{addressTruncate}</span> <Copy id={address}/>
                                    </div>
                                </div>
                                <div className="dropdown-footer">
                                    <p onClick={closeWallet} className="link-close">Logout</p>
                                    <p onClick={handleKeyStore} className="generate-keystore">Generate KeyStore</p>
                                </div>
                            </NavDropdown>
                        </li>
                        <li className="nav-item link"><Darktheme/></li>

                    </Nav>
                </div>
            </Navbar>

            {showKeyStore
                ?
                <GenerateKeyStore setShowKeyStore={setShowKeyStore} className={""}/>
                :
                null}
        </div>
    );
};
export default DashboardHeader;
