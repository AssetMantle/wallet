import React, { useState } from "react";
import logo from "../../assets/images/logo_bold.svg";
import Icon from "../Icon";
import { NavLink } from 'react-router-dom';
import icon_white from "../../assets/images/icon_white.svg";
const Sidebar = () => {
    const options = [
        {
            pathname: '/dashboard/wallet',
            icon: 'wallet',
            name: 'Wallet',
        },
        {
            pathname: '/dashboard/staking',
            icon: 'staking',
            name: 'Staking',
        }

    ];
    const [hideSideNav, setHideSideNav] = useState(false);
    const toggleClass = () => {
        setHideSideNav(!hideSideNav)
    };

    return (
        <div className={hideSideNav ? "side-bar active" : "side-bar"}>
            <div className="content">
                <div className="header-section">
                    <div className="logo"><img src={logo} alt="logo" className="large-screen-logo"/> <img src={icon_white} alt="logo" className="small-screen-logo"/> <span>v0.1.0</span></div>
                </div>
                <ul  className="side-bar-links">
                    {
                        options.map((item, index) => (
                            <NavLink
                                key={index}
                                className="item"
                                to={item.pathname}>
                                <div className="icon-box">
                                <Icon
                                    viewClass="icon"
                                    icon={item.icon}
                                />
                                </div>
                                <span className="text">{item.name}</span>
                            </NavLink>
                        ))
                    }
                    <li>
                        <a href="https://dev.testnet-explorer.persistence.one/" rel="noopener noreferrer" target="_blank" className="item" >
                        <div className="icon-box"><Icon
                            viewClass="arrow-right"
                            icon="explorer"/></div>
                        <span className="text">Explorer</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar
