import React from "react";
import {Tab, Tabs} from "react-bootstrap";
import Send from "../Transactions/Send/index";
import Receive from "./Receive";
import Transactions from "./TransactionsHistory/index";
import TokenInfo from "../Common/TokenInfo";
import InfoRefresh from "../Refresh";
// import SendIbc from "../Transactions/SendIbc/index";
// import Icon from "../../components/Icon";
import ModalWithdraw from "../Transactions/ModalWithDrawAllRewards";
import ModalSetWithdrawAddress from "../Transactions/ModalSetWithdrawAddress";
import FeeModal from "../Common/Fee/Modal";
import KeyStoreModal from "../Common/KeyStore/Modal";
import Loader from "../../components/Loader";
import ModalViewTxnResponse from "../Common/ModalViewTxnResponse";
import ReactGA from "react-ga";
import ModalValidator from "../Staking/Validators/ModalValidator";
import ModalDelegate from "../Transactions/ModalDelegate";
import ModalReDelegate from "../Transactions/ModalReDelegate";
import ModalUnbond from "../Transactions/ModalUnbond";
import ModalWithDraw from "../Transactions/ModalWithDrawAllRewards";
import ModalValidatorWithdraw from "../Transactions/ModalWithdrawValidatorRewards";
import Validators from "../Staking/Validators";
import DelegatedValidators from "../Staking/Validators/DelegatedValidators";

const Wallet = () => {
    const onClick = (key) => {
        window.location.hash = key;
        ReactGA.event({
            category: key,
            action: `Clicked on ${key} Tab`
        });
    };

    const DefaultTab = () => {
        let hash= window.location.hash.replace("#", "");
        console.log("now "+hash.toLowerCase());
        if(hash.toLowerCase() === "send" ||
        hash.toLowerCase() === "receive" ||
        hash.toLowerCase() === "transactions" ||
        hash.toLowerCase() === "all" ||
        hash.toLowerCase() === "delegated") {
            return hash.toLowerCase();
        } else {"Send";}
    };    

    return (
        <>
            <Loader/>
            <KeyStoreModal/>
            <FeeModal/>
            <ModalWithdraw/>
            <ModalSetWithdrawAddress/>
            <ModalViewTxnResponse/>
            <ModalValidator/>
            <ModalDelegate/>
            <ModalReDelegate/>
            <ModalUnbond/>
            <ModalWithDraw/>
            <ModalValidatorWithdraw/>
            <div className="wallet-main-section">
                <TokenInfo/>
                <div className="tabs-section">
                    <Tabs defaultActiveKey={DefaultTab} id="uncontrolled-tab-example" onSelect={onClick}>
                        <Tab eventKey="send" title="Send">
                            <Send/>
                        </Tab>
                        <Tab eventKey="receive" title="Receive">
                            <Receive/>
                        </Tab>
                        <Tab eventKey="transactions" title="Transactions">
                            <Transactions/>
                        </Tab>
                        <Tab eventKey="all" title="All Validators">
                            <Validators/>
                        </Tab>
                        <Tab eventKey="delegated" title="Delegated">
                            <DelegatedValidators/>
                        </Tab>
                    </Tabs>
                    <div>
                        <InfoRefresh/>
                    </div>
                </div>

            </div>
        </>
    );
};
export default Wallet;
