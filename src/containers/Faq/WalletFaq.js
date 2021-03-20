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
                        How to Create a Persistence Wallet
                    </p>
                    <ContextAwareToggle eventKey="1">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                    <Card.Body><p>You can either create a wallet or import an already existing Persistence wallet.</p>
                        <p><b>To create a wallet:</b></p>
                        <ul>
                            <li>
                                From wallet.persistence.one site and click the Create a wallet button
                            </li>
                            <li>In the Secure your wallet window, please take a moment to read notes. Click Continue.  Click Next after you go through the notes.
                            </li>
                            <li>In the Password window, enter your password for the Persistence wallet.</li>
                            <li>Re-enter your password to confirm it.</li>
                            <li>Click Next.</li>
                            <li>You require this password when you sign into your wallet. </li>
                            <li>In the Mnemonic window, view the randomly generated 24-word seed phrase, by default. (Seed phrase is also called as Mnemonic). </li>
                            {/*<li>If you want a 12 word mnemonic, select the 12 button. </li>*/}
                            <li>Copy and securely store your seed phrase in a location of your choice because you may need it in future.
                            </li>
                            <li>Select the Private key json file and copy it in a safe location.</li>
                            <li>Click Next to create your wallet.</li>
                            <p><b>Note:</b> If you already have a Persistence wallet, you can import it using the Import an existing wallet button. You will need to use your mnemonic and password</p>
                        </ul>
                     </Card.Body>
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
                    <Card.Body><ul>
                        <li>The mnemonic (seed phrase) is the readable form of a private key (a set of 12 or 24 words in a specific sequence) allows a user to claim ownership of the assets stored in a wallet.
                        </li>
                    </ul></Card.Body>
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