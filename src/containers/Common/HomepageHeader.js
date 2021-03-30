import React, {useState} from "react";
import { Nav, Navbar, NavLink} from "react-bootstrap";
import ModalFaq from "../Faq";
import {useHistory} from "react-router-dom";
import logo from "../../assets/images/logo_bold.svg";
const HomepageHeader = () => {
    const history = useHistory();
    const [showFaq, setShowFaq] = useState(false);
    const handleHelp = () => {
        setShowFaq(true)
    };

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <div className="container">
                    <Navbar.Brand><Nav.Link href="/">
                        <img src={logo} alt="logo"/>
                    </Nav.Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto">
                            <a className="nav-link" href="https://persistence.one/"  target="_blank" rel="noopener noreferrer">Learn More</a>
                            <NavLink className="nav-link" onClick={handleHelp} target="_blank" rel="noopener noreferrer">Help</NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
            {showFaq
                ?
                <ModalFaq setShowFaq={setShowFaq}/>
                :
                null}
        </>
    );
};
export default HomepageHeader;