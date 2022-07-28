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

const Wallet = ({hash}) => {
    const onClick = (key) => {
        window.location.hash = key;
        ReactGA.event({
            category: key,
            action: `Clicked on ${key} Tab`
        });
    };

    const walletTabsArray = ["send", "receive", "transactions", "all", "delegated"];
    const walletTabsTitleArray = ["Send", "Receive", "Transactions", "All Validators", "Delegated"];


    const DefaultTab = () => {
        let finalHash = walletTabsArray.indexOf(hash) == -1 ? walletTabsArray[0] : hash;
        return finalHash;
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
                        <Tab eventKey={walletTabsArray[0]} title={walletTabsTitleArray[0]}>
                            <Send/>
                        </Tab>
                        <Tab eventKey={walletTabsArray[1]} title={walletTabsTitleArray[1]}>
                            <Receive/>
                        </Tab>
                        <Tab eventKey={walletTabsArray[2]} title={walletTabsTitleArray[2]}>
                            <Transactions/>
                        </Tab>
                        <Tab eventKey={walletTabsArray[3]} title={walletTabsTitleArray[3]}>
                            <Validators/>
                        </Tab>
                        <Tab eventKey={walletTabsArray[4]} title={walletTabsTitleArray[4]}>
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
