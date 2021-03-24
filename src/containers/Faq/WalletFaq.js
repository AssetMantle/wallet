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
                        How to create a Persistence wallet?
                    </p>
                    <ContextAwareToggle eventKey="1">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>
                        <ul>
                            <li>
                                Go to wallet.persistence.one site and click the Create Wallet button
                            </li>
                            <li>In the About Persistence Wallet pop-up, read carefully on how to the Secure your wallet
                            </li>
                            <li>After carefully reading the steps on how to secure your wallet, Click Next
                            </li>
                            <li>In the Mnemonic window, you can view a randomly generated 24-word seed phrase (Seed phrase is also called as Mnemonic)
                            </li>
                            <li>Copy and securely store your seed phrase in a file location of your choice for future use
                            </li>
                            <li>Input the missing fields from the seed phrase
                            </li>
                            <li>Click on Generate KeyStore File and enter a password of your choice to encrypt the KeyStore File</li>
                            <li>Click Submit to download your KeyStore File
                            </li>
                            <li>You will be taken back to the generate KeyStore File page. Click Next to generate your wallet
                            </li>
                            <li>You have successfully created your Persistence wallet</li>
                        </ul>
                     </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        How to import an existing Persistence wallet?
                    </p>
                    <ContextAwareToggle eventKey="2">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="2">
                    <Card.Body><ul>
                        <li>Go to wallet.persistence.one site and click the Import an existing wallet button</li>
                        <li>You can import your wallet using either your private key (KeyStore.json file) or your Mnemonic (Seed Phrase).
                        </li>
                        <li>To import wallet using Private Key, click on Use Private Key
                        </li>
                        <li>Enter the password used to encrypt your private key. This password will be used to decrypt your KeyStore.json file now</li>
                        <li>Upload your KeyStore file and click on Next. Click next again to successfully import your wallet</li>
                        <li>If you wish to import your wallet using your Seed Phrase (Mnemonic), after clicking on Import an existing wallet, input your mnemonic and click next
                        </li>
                        <li>You can generate your KeyStore file and save it or you can directly skip to importing your wallet
                        </li>
                        <li>Click on Next again to successfully import your wallet</li>
                    </ul></Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        What is a Mnemonic?
                    </p>
                    <ContextAwareToggle eventKey="3">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="3">
                    <Card.Body><p>The mnemonic (seed phrase) is the readable form of a private key (a set of 12 or 24 words in a specific sequence) that allows a user to claim ownership of the assets stored in a wallet
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