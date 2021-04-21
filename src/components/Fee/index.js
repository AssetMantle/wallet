import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import Icon from "../Icon";

const FeeContainer = () => {
    const popoverSetupAddress = (
        <Popover id="popover-memo">
            <Popover.Content>
                Make sure wallet contains sufficient balance to pay fee.
            </Popover.Content>
        </Popover>
    );
    return (
        <p className="fee"> Default fee of {(localStorage.getItem('fee')*1) / 1000000}xprt
            will be cut from the wallet.
            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverSetupAddress}>
                <button className="icon-button info" type="button">
                    <Icon
                        viewClass="arrow-right"
                        icon="info"
                    />
                </button>
            </OverlayTrigger></p>
    );
};

export default FeeContainer;
