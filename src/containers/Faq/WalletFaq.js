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
                    <Card.Body>
                        <p>You need to have a Persistence wallet to store or transact or stake your XPRT token. Create a wallet or import an already existing Persistence wallet. To create a wallet:
                        </p>
                        <br/>
                        <ul>
                            <li>
                                From wallet.persistence.one site and click the <b>Create</b> a wallet button.
                            </li>
                            <li>In the <b>Secure your wallet</b> window, please take a moment to read notes. Click <b>Continue.</b> After carefully reading the steps on how to secure your wallet, Click <b>Next</b> after you go through the info.
                            </li>
                            <li>In the <b>Password</b> window, enter a password for the Persistence wallet.
                            </li>
                            <li>In the Mnemonic window, you can view a randomly generated 24-word seed phrase (Seed phrase is also called as Mnemonic).
                            </li>
                            <li>Enter the password again to confirm.
                            </li>
                            <li>Click <b>Next.</b>
                            </li>
                            <p><b>Note:</b> You will require this password when you sign into your wallet. So copy the password in a file. Save and store the file safe.</p>
                            <li>In the <b>Mnemonic</b> window, you view the randomly generated <b>24-word seed</b> phrase, by default. (Seed phrase is also called as Mnemonic.) If you want a 12 word mnemonic, select the 12 button.
                            </li>
                            <li>Copy and securely store your seed phrase in a file location of your choice because you may need it in future.
                            </li>
                            <li>Select the <b>Private key json</b> file and copy it in a file and store it in a safe location.
                            </li>
                            <li>Click <b>Next</b> to create your wallet</li>
                        </ul>
                        <p><b>Note:</b> If you already have a Persistence wallet, you can import it using the Import an existing wallet button. You will need to use your mnemonic and password. So keep it handy.</p>
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
                        <li>Go to wallet.persistence.one site and click the Import an existing wallet button.</li>
                        <li>You can import your wallet using either your private key (KeyStore.json file) or your Mnemonic (Seed Phrase).
                        </li>
                        <li>To import wallet using Private Key, click on Use Private Key.
                        </li>
                        <li>Enter the password used to encrypt your private key. This password will be used to decrypt your KeyStore.json file now.</li>
                        <li>Upload your KeyStore file and click on Next. Click next again to successfully import your wallet.</li>
                        <li>If you wish to import your wallet using your Seed Phrase (Mnemonic), after clicking on Import an existing wallet, input your mnemonic and click next.
                        </li>
                        <li>You can generate your KeyStore file and save it or you can directly skip to importing your wallet.
                        </li>
                        <li>Click on Next again to successfully import your wallet.</li>
                    </ul></Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        What is a mnemonic?
                    </p>
                    <ContextAwareToggle eventKey="3">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="3">
                    <Card.Body><p>Mnemonic is a secret passphrase to recover your private key.
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