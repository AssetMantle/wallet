import React, { useState} from 'react';
// import InputFieldNumber from "../../../components/InputFieldNumber";
// import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import Icon from "../../../components/Icon";
import { Card} from "react-bootstrap";
import AccountNumber from "./AccountNumber";
import AccountIndex from "./AccountIndex";
import Bip39PassPhrase from "./Bip39PassPhrase";

const Advanced = () => {
    const {t} = useTranslation();
    const [advanceMode, setAdvanceMode] = useState(false);
    // const amount = floatCoin(props.balance);
    // const amount = useSelector((state) => state.send.amount);
    // const dispatch = useDispatch();`

    const handleAccordion = () => {
        setAdvanceMode(!advanceMode);
    };

    return (
    // .advanced-wallet-accordion .card .collapse.show
        <div className="advanced-wallet-accordion">
            <Card>
                <Card.Header>
                    <p>
                        {t("ADVANCED")}
                    </p>
                    <button
                        type="button"
                        className="accordion-button"
                        onClick={handleAccordion}
                    >
                        {advanceMode ?
                            <Icon
                                viewClass="arrow-right"
                                icon="up-arrow"/>
                            :
                            <Icon
                                viewClass="arrow-right"
                                icon="down-arrow"/>}

                    </button>
                </Card.Header>
                <div className={`accordion-body ${advanceMode ? 'show': ''}`}>
                    <AccountNumber/>
                    <AccountIndex />
                    <Bip39PassPhrase />
                </div>
            </Card>
        </div>
    );
};


export default Advanced;
