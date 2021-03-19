import React, {useState} from "react";
import Icon from "../../components/Icon";
import {Dropdown} from "react-bootstrap";
import ReactQRCode from "qrcode.react";
import Copy from "../../components/Copy";
import ModalFaq from "../Faq";
import {useHistory} from "react-router-dom";
import helper from "../../utils/helper";
const Header = (props) => {
    const history = useHistory();
    const [showFaq, setShowFaq] = useState(false);
    let address  = helper.stringTruncate('persistence1095fgex3h37zl4yjptnsd7qfmspesvav7xhgwt');
    const handleHelp = () => {
        setShowFaq(true)
    };
    const closeWallet = () =>{
        localStorage.setItem('loginToken', '');
        history.push('/');
    };
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
                            <div className="qr-box">
                                <ReactQRCode value="persistence1095fgex3h37zl4yjptnsd7qfmspesvav7xhgwt"/>
                            </div>

                            <p className="key">Wallet Address</p>
                            <p className="address">{address} <Copy id="XPR47rueyd4t19hry57v43bx9wef9u39z637s29fuf4y6rhk8ocv"/> </p>
                        </div>
                        <div className="footer">
                            <p onClick={closeWallet} className="link-close">Close Wallet</p>
                            <p>Account</p>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>

                <p onClick={handleHelp}><Icon
                    viewClass="help"
                    icon="help"/> Help</p>
            </div>
            {showFaq
            ?
                <ModalFaq setShowFaq={setShowFaq}/>
            :
            null}
        </div>
    );
};
export default Header;