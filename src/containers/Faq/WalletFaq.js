import React, {useContext} from "react";
import {Accordion, Card, useAccordionToggle, AccordionContext} from "react-bootstrap";

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

const WalletFaq = () => {
    return (
        <Accordion>
            <Card>
                <Card.Header>
                    <p>
                        About Persistence
                    </p>
                    <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body><p>Persistence is an interoperable protocol built to facilitate the creation of next-gen
                        financial products. XPRT is Persistence’s native token which is used to secure the Persistence
                        network. Staking rewards for XPRT are expected to be in the range of ~30-40%.</p></Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        How do I setup a Persistence Wallet?
                    </p>
                    <ContextAwareToggle eventKey="1">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                    <Card.Body><p>You can can either create a new wallet or import an already existing wallet.</p>
                        <p>To create a new wallet, go to wallet.persistence.one and click on the create wallet option.
                            You will get a pop-up on how to secure your wallet, please take a moment to read it. After
                            carefully reading the steps on how to secure your wallet, please enter a password for your
                            wallet and confirm it in the next step. This password would be required for you to login
                            into your wallet. You would see a randomly generated 24-word seed phrase, you can also
                            choose the 12-word seed phrase option (Seed phrase is also called Mnemonic). Copy and
                            securely store your seed phrase and click next to create your wallet.
                        </p>
                        <p>If you already have a persistence wallet and want to Import it, click on import wallet. In
                            this next step, you are required to input your seed phrase (mnemonic) and then enter your
                            wallet password to import it and login securely.
                        </p></Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        What is a mnemonic?
                    </p>
                    <ContextAwareToggle eventKey="2">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="2">
                    <Card.Body><p>The mnemonic (seed phrase) is the readable form of a private key which is a set of
                        12/24 words which if used in a sequence allows a user to claim ownership of the assets stored in
                        a wallet</p></Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        How do I Stake XPRT?
                    </p>
                    <ContextAwareToggle eventKey="3">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="3">
                    <Card.Body><p>How do I Stake XPRT?
                    </p></Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        How do I claim staking rewards?
                    </p>
                    <ContextAwareToggle eventKey="4">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="4">
                    <Card.Body><p>How do I claim staking rewards?
                    </p></Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        How do I redelegate my XPRT to another validator?
                    </p>
                    <ContextAwareToggle eventKey="5">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="5">
                    <Card.Body><p>How do I redelegate my XPRT to another validator?
                    </p></Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        Telegram Chat
                    </p>
                    <ContextAwareToggle eventKey="5">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="5">
                    <Card.Body><p>Have any more questions? Please feel free to ask more questions in our telegram group.
                        <a href="https://t.me/PersistenceOneChat" rel="noopener noreferrer" target="_blank"
                           title="Community Chat"> (PersistenceOneChat)</a>
                    </p></Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>

    )
}
export default WalletFaq;