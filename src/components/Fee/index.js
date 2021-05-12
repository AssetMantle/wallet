import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import Icon from "../Icon";
import transactions from "../../utils/transactions";

const FeeContainer = () => {
    const mode = localStorage.getItem('loginMode');
    const popoverSetupAddress = (
        <Popover id="popover-memo">
            <Popover.Content>
                Ensure that your wallet contains adequate balance to debit the fee.
            </Popover.Content>
        </Popover>
    );
    return (
        <>
            {
                mode === "normal" ?
                    <p className="fee">A default fee of {transactions.XprtConversion(localStorage.getItem('fee')*1)} XPRT is
                        deducted from your wallet.
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverSetupAddress}>
                        <button className="icon-button info" type="button">
                            <Icon
                                viewClass="arrow-right"
                                icon="info"
                            />
                        </button>
                    </OverlayTrigger>
                    </p>
                    : ""
            }
        </>

    );
};

export default FeeContainer;
