import React, {useEffect, useState} from "react";
import "../utils/kepler";
import KeplerWallet from "../utils/kepler";
import {useHistory} from "react-router-dom";
import {Nav, Navbar, NavLink} from "react-bootstrap";
import logo from "../assets/images/logo_lite.svg";
import ModalFaq from "../containers/Faq";
import helper from "../utils/helper";

const KeplerHome = () => {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState("");
    const [showFaq, setShowFaq] = useState(false);
    const [address, setAddress]= useState("");
    useEffect(() => {
        const kepler = KeplerWallet();
        kepler.then(function (item) {
            const address = helper.stringTruncate(localStorage.getItem("address"));
            setAddress(address);
            console.log(item, "kepler response")
        }).catch(err => {
            console.log(err.message, "kepler err")
            setErrorMessage(err.message)
        });
    }, []);
    const handleKepler = () => {
        setErrorMessage("")
        const kepler = KeplerWallet();
        kepler.then(function (item) {
            console.log(item, "kepler item")
        }).catch(err => {
            setErrorMessage(err.message)
        });
        //
        // console.log(localStorage.getItem('address'),"address");
        //
        // // const address = localStorage.getItem('address');
        // // if(address !== undefined && address !== null && address !== ""){
        // //     localStorage.setItem('loginMode', 'kepler');
        // //     localStorage.setItem('loginToken', 'loggedIn');
        // //     history.push('/dashboard/wallet');
        // // }
    };

    const handleRoute = () => {
            localStorage.setItem('loginMode', 'kepler');
            localStorage.setItem('loginToken', 'loggedIn');
            history.push('/dashboard/wallet');
    };

    const handleHelp = () => {
        setShowFaq(true)
    };

    return (
        <div className="kepler-section">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <div className="container">
                    <Navbar.Brand><Nav.Link>
                        <img src={logo} alt="logo"/>
                    </Nav.Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto">
                            <a className="nav-link" href="https://persistence.one/" target="_blank"
                               rel="noopener noreferrer">Learn More</a>
                            <NavLink className="nav-link" onClick={handleHelp} target="_blank"
                                     rel="noopener noreferrer">Help</NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
            <div className="kepler-container">
                <div className="info">
                    <h3>Use Keplr Browser Extension</h3>
                    {errorMessage !== "" ?
                        <>
                            <div className="buttons">
                                <button className="button button-primary" onClick={() => handleKepler()}>Connect

                                </button>
                            </div>

                            <p>There was an error connecting to the Keplr extension:</p>
                            <p>{errorMessage}</p>
                        </>
                        :
                        <>

                            <p>Below account we've received from the Keplr browser extension.</p>
                            <div className="buttons-list">
                                <p>{address}</p>
                                    <button className="button button-primary" onClick={() => handleRoute()}>Use
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