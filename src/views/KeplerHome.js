import React, {useState} from "react";
import {Navbar, NavLink, Nav} from "react-bootstrap";
import logo from "../assets/images/logo_lite.svg";
import "../utils/kepler";
import KeplerWallet from "../utils/kepler";
const KeplerHome = () => {
    const handleKepler = ()=>{
        const kepler = KeplerWallet();
        console.log(kepler,"kepler response")
    };
    return (
        <div className="buttons">
            <button className="button button-primary" onClick={()=>handleKepler("kepler")}>Use Kepler</button>
        </div>
    )
};
export default KeplerHome;