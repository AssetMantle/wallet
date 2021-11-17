import React, {useContext, useState} from 'react';
// import InputFieldNumber from "../../../components/InputFieldNumber";
// import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import Icon from "../../../components/Icon";
import {Accordion, AccordionContext, Card, useAccordionToggle} from "react-bootstrap";

const Advanced = () => {
    const {t} = useTranslation();
    const [advanceMode, setAdvanceMode] = useState(false);
    // const amount = floatCoin(props.balance);
    // const amount = useSelector((state) => state.send.amount);
    // const dispatch = useDispatch();

    function ContextAwareToggle({eventKey, callback}) {
        const currentEventKey = useContext(AccordionContext);

        const decoratedOnClick = useAccordionToggle(
            eventKey,
            () => callback && callback(eventKey),
        );
        const handleAccordion = (event) => {
            decoratedOnClick(event);
            setAdvanceMode(!advanceMode);
        };
        const isCurrentEventKey = currentEventKey === eventKey;

        return (
            <button
                type="button"
                className="accordion-button"
                onClick={handleAccordion}
            >
                {isCurrentEventKey ?
                    <Icon
                        viewClass="arrow-right"
                        icon="up-arrow"/>
                    :
                    <Icon
                        viewClass="arrow-right"
                        icon="down-arrow"/>}

            </button>
        );
    }
    return (
        <Accordion className="advanced-wallet-accordion">
            <Card>
                <Card.Header>
                    <p>
                        {t("ADVANCED")}
                    </p>
                    <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                </Accordion.Collapse>
            </Card>
        </Accordion>


    );
};


export default Advanced;
