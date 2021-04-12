import React, {useContext} from "react";
import {Accordion, Card, useAccordionToggle, AccordionContext} from "react-bootstrap";
import {useTranslation} from "react-i18next";

function ContextAwareToggle({children, eventKey, callback}) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
        <button
            type="button"
            className="accordion-button"
            onClick={decoratedOnClick}
        >
            {isCurrentEventKey ? "-" : "+"}

        </button>
    );
}

const StakingFaq = () => {
    const {t} = useTranslation();
    return (
        <Accordion>
            <Card>
                <Card.Header>
                    <p>
                        {t("STAKING_FAQ1")}
                    </p>
                    <ContextAwareToggle eventKey="11">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="11">
                    <Card.Body>
                        <p>
                            {t("STAKING_FAQ11")}
                        </p>
                        <ul>
                            <li>
                                {t("STAKING_FAQ12")}
                            </li>
                            <li>
                                {t("STAKING_FAQ13")}
                            </li>
                            <li> {t("STAKING_FAQ14")}
                            </li>
                            <p> {t("STAKING_FAQ15")}</p>
                            <li>{t("STAKING_FAQ16")}</li>
                            <li>{t("STAKING_FAQ17")}
                            </li>
                            <li>{t("STAKING_FAQ18")}</li>
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        {t("STAKING_FAQ2")}
                    </p>
                    <ContextAwareToggle eventKey="12">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="12">
                    <Card.Body><p>{t("STAKING_FAQ21")}</p>
                        <ul>
                            <li>{t("STAKING_FAQ22")}
                            </li>
                            <li>{t("STAKING_FAQ23")}</li>
                            <li>{t("STAKING_FAQ24")}
                            </li>
                            <li>{t("STAKING_FAQ25")}</li>
                            <li>{t("STAKING_FAQ26")}</li>
                            <li>{t("STAKING_FAQ27")}</li>
                            <li>{t("STAKING_FAQ28")}
                            </li>

                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        {t("STAKING_FAQ3")}
                    </p>
                    <ContextAwareToggle eventKey="13">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="13">
                    <Card.Body><p>  {t("STAKING_FAQ31")}</p>

                        <ul>
                            <li>  {t("STAKING_FAQ32")}
                            </li>
                            <li>  {t("STAKING_FAQ33")}
                            </li>
                            <li>  {t("STAKING_FAQ34")}
                            </li>
                            <li>  {t("STAKING_FAQ35")}</li>
                            <li>  {t("STAKING_FAQ36")}</li>
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        {t("STAKING_FAQ4")}
                    </p>
                    <ContextAwareToggle eventKey="14">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="14">
                    <Card.Body><p> {t("STAKING_FAQ41")}</p>
                        <ul>
                            <li> {t("STAKING_FAQ42")}
                            </li>
                            <li> {t("STAKING_FAQ43")}
                            </li>
                            <li> {t("STAKING_FAQ44")}
                            </li>
                            <li> {t("STAKING_FAQ45")}
                            </li>
                            <li> {t("STAKING_FAQ46")}
                            </li>
                            <li> {t("STAKING_FAQ47")}</li>
                            <li> {t("STAKING_FAQ48")}</li>
                            <li> {t("STAKING_FAQ49")}</li>
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        {t("STAKING_FAQ5")}
                    </p>
                    <ContextAwareToggle eventKey="15">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="15">
                    <Card.Body><p>   {t("STAKING_FAQ51")}
                    </p>

                        <ul>
                            <li>{t("STAKING_FAQ52")}
                            </li>
                            <li> {t("STAKING_FAQ53")}
                            </li>
                            <li> {t("STAKING_FAQ54")}</li>
                            <li> {t("STAKING_FAQ55")}</li>
                            <li> {t("STAKING_FAQ56")}</li>
                            <li> {t("STAKING_FAQ57")}
                            </li>
                            <li> {t("STAKING_FAQ58")}
                            </li>
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>

    )
}
export default StakingFaq;