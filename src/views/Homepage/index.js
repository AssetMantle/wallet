import React, {useState} from "react";
import {Navbar, NavLink, Nav, NavDropdown, Button} from "react-bootstrap";
import logo from "../../assets/images/logo_lite.svg";
import {useHistory} from "react-router-dom";
import dark_icon from "../../assets/images/dark_icon.svg";
import CreateWallet from "../../containers/CreateWallet";
import ImportWallet from "../../containers/ImpotWallet";
import wallet from "../../utils/wallet"
const Homepage = () => {
    const history = useHistory();
    const [routName, setRoutName] = useState("false");
    const [response, setResponse] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const handleRoute = (name) =>{
        setRoutName(name);
    }
    const handleRandomWallet = () =>{
        const responseData = wallet.createRandomWallet();
        console.log(responseData, "sdfdf")
        history.push('/dashboard/wallet');
        localStorage.setItem('address', responseData.address);
        localStorage.setItem('mnemonic', responseData.mnemonic);
        setResponse(responseData);
        if (responseData.error) {
            setErrorMessage(responseData.error);
        }
    }
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
                            <NavLink className="nav-link" to="/marketplace">Learn More</NavLink>
                            <NavLink className="nav-link" to="/faq">Help</NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
            <div className="home-page-body">
                <div className="content">
                    <h3 className="heading">
                        MANAGE YOUR $XPRT TOKENS
                    </h3>
                    <p className="sub-text">36% APY FOR 1 MONTH ACCOUNT HOLDERS</p>
                    <div className="buttons">
                        <button className="button button-primary" onClick={()=>handleRoute('createWallet')}>Create Wallet</button>
                        <button className="button button-secondary" onClick={()=>handleRoute('importWallet')}>Import Wallet</button>
                        <button className="button button-primary" onClick={()=>handleRandomWallet()}>Random Wallet</button>
                    </div>
                    <div className="info-boxes">
                        <div className="info-box first">
                            <h4>23%</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
                        </div>
                        <div className="info-box second">
                            <h4>15%</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
                        </div>
                    </div>
                    <p className="border-logo"><img src={dark_icon} alt="dark-icon" /></p>
                </div>
                <p className="footer-text">
                    Terms of Use | Persistence Wallet v0.1.0
                </p>
            </div>
            {
                routName === "createWallet" ?
                    <CreateWallet/>
                    : null
            }
            {
                routName === "importWallet" ?
                    <ImportWallet/>
                    : null
            }

        </div>


    )
};
export default Homepage;