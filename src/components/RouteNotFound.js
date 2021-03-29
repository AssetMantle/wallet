import React, {useState} from "react";
import {Nav, Navbar, NavLink} from "react-bootstrap";
import logo from "../assets/images/logo_lite.svg";
import ModalFaq from "../containers/Faq";

const RouteNotFound = () => {
    const [showFaq, setShowFaq] = useState(false);

    const handleHelp = () => {
        setShowFaq(true)
    };
    return (
        <div className="home-page pageError">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <div className="container">
                    <Navbar.Brand><NavLink to="/">
                        <img src={logo} alt="logo"/>
                    </NavLink></Navbar.Brand>
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
            <div className="text-container">
                <h3>Page Not Found</h3>
            </div>
            {showFaq
                ?
                <ModalFaq setShowFaq={setShowFaq}/>
                :
                null}
        </div>
    );
}
export default RouteNotFound;