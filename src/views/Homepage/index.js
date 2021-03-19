import React, {useState} from "react";
import {Navbar, NavLink, Nav, NavDropdown, Button} from "react-bootstrap";
import logo from "../../assets/images/logo_lite.svg";
import {useHistory} from "react-router-dom";
import dark_icon from "../../assets/images/dark_icon.svg";
import CreateWallet from "../../containers/CreateWallet";
import ImportWallet from "../../containers/ImpotWallet";
import wallet from "../../utils/wallet"
import ModalFaq from "../../containers/Faq";
const Homepage = () => {
    const history = useHistory();
    const [routName, setRoutName] = useState("false");
    const [response, setResponse] = useState("");
    const [showFaq, setShowFaq] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const handleRoute = (name) =>{
        setRoutName(name);
    }
    const handleHelp = () => {
        setShowFaq(true)
    };
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
                            <a className="nav-link" href="https://persistence.one/"  target="_blank" rel="noopener noreferrer">Learn More</a>
                            <NavLink className="nav-link" onClick={handleHelp}  target="_blank" rel="noopener noreferrer">Help</NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
            <div className="home-page-body">
                <div className="content">
                    <h3 className="heading">
                        Securely store, transfer and stake your XPRT tokens with the Persistence Wallet
                    </h3>
                    <p className="sub-text">Earn upto 35% annual rewards by staking your XPRT</p>
                    <div className="buttons">
                        <button className="button button-primary" onClick={()=>handleRoute('createWallet')}>Create Wallet</button>
                        <p onClick={()=>handleRoute('importWallet')} className="import">Import an existing wallet
                        </p>
                    </div>
                    <div className="info-boxes">
                        <div className="info-box first">
                            <h4>26</h4>
                            <p>Unique Wallets</p>
                        </div>
                        <div className="info-box second">
                            <h4>152</h4>
                            <p>XPRT stakers</p>
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
                    <CreateWallet setRoutName={setRoutName}/>
                    : null
            }
            {
                routName === "importWallet" ?
                    <ImportWallet setRoutName={setRoutName}/>
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