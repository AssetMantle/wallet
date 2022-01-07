import React, {useContext, useState} from "react";
import {Accordion, AccordionContext, Card, Form, useAccordionToggle,} from "react-bootstrap";
import Icon from "../../components/Icon";
import helper from "../../utils/helper";
import {useTranslation} from "react-i18next";
import config from "../../config";

const AdvancedFields = (props) => {
    const {t} = useTranslation();
    const [passphraseError, setPassphraseError] = useState(false);

    function ContextAwareToggle({eventKey, callback}) {
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

    const handlePassphrase = (evt) => {
        const result = helper.validatePassphrase(evt.target.value);
        setPassphraseError(result);
        props.setBip39Passphrase(evt.target.value);
    };

    const handleAccountNumberChange = (evt) => {
        props.setAccountNumber(evt.target.value);
    };

    const handleAccountIndexChange = (evt) => {
        props.setAccountIndex(evt.target.value);
    };

    const handleAccountNumberKeypress = e => {
        if (e.key === "e" || e.key === "-" || e.key === "+") {
            e.preventDefault();
        } else {
            const accountNumber = document.getElementById('accountNumberReset').value;
            if (parseInt(accountNumber) > config.maxAccountIndex || parseInt(accountNumber) < 0) {
                e.preventDefault();
            }
        }
    };

    const handleIndexKeypress = e => {
        if (e.key === "e" || e.key === "-" || e.key === "+") {
            e.preventDefault();
        } else {
            const addressIndex = document.getElementById('accountIndexReset').value;
            if (parseInt(addressIndex) > config.maxAccountIndex || parseInt(addressIndex) < 0) {
                e.preventDefault();
            }
        }
    };
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
                    <>
                        <div className="form-field">
                            <p className="label"> {t("ACCOUNT")}</p>
                            <Form.Control
                                type="number"
                                max={config.maxAccountIndex}
                                name="accountNumber"
                                id="accountNumberReset"
                                onKeyPress={handleAccountNumberKeypress}
                                onChange={handleAccountNumberChange}
                                placeholder={t("ACCOUNT_NUMBER")}
                                required={false}
                            />
                        </div>
                        <div className="form-field">
                            <p className="label">{t("ACCOUNT_INDEX")}</p>
                            <Form.Control
                                type="number"
                                max={config.maxAccountIndex}
                                name="accountIndexReset"
                                id="accountIndexReset"
                                onKeyPress={handleIndexKeypress}
                                onChange={handleAccountIndexChange}
                                placeholder={t("ACCOUNT_INDEX")}
                                required={false}
                            />
                        </div>
                        <div className="form-field passphrase-field">
                            <p className="label">{t("BIP_PASSPHRASE")}</p>
                            <Form.Control
                                type="password"
                                name="bip39Passphrase"
                                maxLength="50"
                                id="bip39PassphraseReset"
                                placeholder={t("ENTER_BIP_PASSPHRASE")}
                                onChange={handlePassphrase}
                                required={false}
                            />
                            {passphraseError ?
                                <span className="passphrase-error">{t("BIP_PASSPHRASE_ERROR")}</span>
                                : null}
                        </div>
                    </>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
};
export default AdvancedFields;
