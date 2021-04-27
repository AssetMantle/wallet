import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import Icon from "../Icon";
import config from "../../config";

const FeeContainer = () => {
    const mode = localStorage.getItem('loginMode');
    const popoverSetupAddress = (
        <Popover id="popover-memo">
            <Popover.Content>
                Make sure wallet contains sufficient balance to pay fee.
            </Popover.Content>
        </Popover>
    );
    return (
        <>
            {
                mode === "normal" ?
                    <p className="fee">A default fee of {(localStorage.getItem('fee') * 1) / config.xprtValue} is
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
