import React, {useState} from "react";
import xprt from "../../assets/images/xprt.svg";
import ModalWithdraw from "../Wallet/ModalWithdraw";

const TokenInfo = () => {
    const [rewards, setRewards] = useState(false);
    const handleRewards = () => {
        setRewards(true);
    }
    return (
        <div className="token-info-section">
            <div className="xprt-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <img src={xprt} alt="xprt"/>
                        <p className="total-supply">100,000,000.00</p>
                    </div>
                    <div className="line">
                        <p className="key">Your balance</p>
                        <p className="value">$40,000,000.00</p>
                    </div>
                </div>
            </div>
            <div className="price-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="key">Current Price</p>
                        <p className="value"> $0.40</p>
                    </div>
                    <div className="line">
                        <p className="key">Delegated</p>
                        <p className="value">50,000 XPRT</p>
                    </div>
                </div>
            </div>
            <div className="rewards-info info-box">
                <div className="inner-box">
                    <div className="line">
                        <p className="key">Rewards (24h)</p>
                        <p className="value rewards" onClick={handleRewards}>485.12 XPRT</p>
                    </div>
                    <div className="line">
                        <p className="key">Unbonding</p>
                        <p className="value">1500.45 XPRT</p>
                    </div>
                </div>
            </div>
            {rewards ?
                <ModalWithdraw/>
                : null
            }

        </div>
    );
};
export default TokenInfo;