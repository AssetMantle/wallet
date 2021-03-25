import React, {useState} from "react";
import {Navbar, NavLink, Nav} from "react-bootstrap";
import logo from "../assets/images/logo_lite.svg";
import "../utils/kepler";
const KeplerHome = () => {

    return (
        <div className="home-page">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <div className="container">
                    <Navbar.Brand><Nav.Link>
                        <img src={logo} alt="logo"/>
                    </Nav.Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                </div>
            </Navbar>
            <div className="home-page-body">
                <div className="content">
                    <div className="buttons">
                        <button className="button button-primary">
                            Connect
                        </button>
                    </div>
                </div>
            </div>
        </div>


    )
};
export default KeplerHome;