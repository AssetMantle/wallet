import React, {useContext, useState} from "react";
import {
    Form,
    OverlayTrigger,
    Popover,
    Accordion,
    Card,
    Button,
    AccordionContext,
    useAccordionToggle
} from "react-bootstrap";
import Icon from "../components/Icon";
import {useHistory} from "react-router-dom";


const AdvanceMode = (props) => {
    const history = useHistory();
    function ContextAwareToggle({children, eventKey, callback}) {
        const currentEventKey = useContext(AccordionContext);

        const decoratedOnClick = useAccordionToggle(
            eventKey,
            () => callback && callback(eventKey),
        );
        const handleAccordion = (event) => {
            decoratedOnClick(event);
            props.setAdvanceMode(!props.advanceMode);
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
                        Advanced
                    </p>
                    <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <>
                        <div className="form-field">
                            <p className="label">Account</p>
                            <Form.Control
                                type="text"
                                name="accountNumber"
                                id={props.accoundID}
                                placeholder="Account number"
                                required={props.advanceMode ? true : false}
                            />
                        </div>
                        <div className="form-field">
                            <p className="label">Account Index</p>
                            <Form.Control
                                type="text"
                                name="accountIndex"
                                id={props.accoundIndexID}
                                placeholder="Account Index"
                                required={props.advanceMode ? true : false}
                            />
                        </div>
                        <div className="form-field">
                            <p className="label">bip39Passphrase</p>
                            <Form.Control
                                type="password"
                                name="bip39Passphrase"
                                id={props.passphraseID}
                                placeholder="Enter bip39Passphrase (optional)"
                                required={false}
                            />
                        </div>
                    </>
                </Accordion.Collapse>
            </Card>
        </Accordion>

    );
};
export default AdvanceMode;
