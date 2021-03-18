import React, {useState} from "react";
import Icon from "../../components/Icon";
import {Dropdown} from "react-bootstrap";
import ReactQRCode from "qrcode.react";
import Copy from "../../components/Copy";
import ModalFaq from "../Faq";
const Header = (props) => {
    const [show, setShow] = useState(false);
    const handleHelp = () => {
        setShow(true)
    }
    return (
        <div className="header">
            <h3 className="title">{props.name}</h3>
            <div className="profile-section">
                <Dropdown className="profile-dropdown">
                    <Dropdown.Toggle  id="dropdown-basic">
                        <Icon
                            viewClass="profile"
                            icon="profile"/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <div className="info">
                            <ReactQRCode value="http://facebook.github.io/react/"/>
                            <p className="key">Wallet Address</p>
                            <p className="address">XPR47rueyd4t19hry57v43bx9wef9u39z637s29fuf4y6rhk8ocv <Copy id="XPR47rueyd4t19hry57v43bx9wef9u39z637s29fuf4y6rhk8ocv"/> </p>
                        </div>
                        <div className="footer">
                            <p>Close Wallet</p>
                            <p>Account</p>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>

                <p onClick={handleHelp}><Icon
                    viewClass="help"
                    icon="help"/> Help</p>
            </div>
            {show
            ?
                <ModalFaq/>
            :
            null}
        </div>
    );
};
export default Header;