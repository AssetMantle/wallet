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

const StakingFaq = () => {
    return (
        <Accordion>
            <Card>
                <Card.Header>
                    <p>
                        Sending XPRT Token
                    </p>
                    <ContextAwareToggle eventKey="11">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="11">
                    <Card.Body>
                        <p>
                            Review the XPRT token in your wallet. You may want to send some XPRT token to someone who
                            has a persistence wallet
                        </p>
                        <ul>
                            <li>
                                From the <b>Wallet</b> page, <b>Send</b> tab, copy and paste <b>Recipient Address</b>.
                                You obtain their wallet address off the application.
                            </li>
                            <li>
                                Enter the XPRT Token in the <b>Amount</b> field.
                            </li>
                            <li>Optionally, enter your comments or remarks in <b>Memo</b>.
                            </li>
                            <p>The application calculates the transaction fee in XPRT token and is deducted from your
                                wallet.</p>
                            <li>Click <b>Send</b>.</li>
                            <li>Enter your password or mnemonic. Or toggle to upload your keystore json file. A
                                confirmation message appears after the successful sending of the XPRT token. The
                                transaction hash link is provided. You can click the link and view the transaction
                                details or you can review the details under
                                the <b>Transactions</b> tab. <b>Note:</b> Failed transactions don’t appear in
                                the <b>Transactions</b> tab.
                            </li>
                            <li>Click <b>Done</b> to return to the <b>Wallet</b> page.</li>
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        How to Delegate XPRT Token
                    </p>
                    <ContextAwareToggle eventKey="12">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="12">
                    <Card.Body><p>Delegate your XPRT token to a validator such as Cosmostation, StakeFish, and so on. As
                        you stake your tokens, you can earn rewards too.</p>
                        <ul>
                            <li>From the <b>Staking</b> page, <b>Active</b> tab, select a validator and then select
                                the <b>Actions</b> button.
                            </li>
                            <li>A window appears with the validator name, commission percentage, and actions you can
                                perform. Click <b>Delegate.</b></li>
                            <li>In the Delegating to "VALIDATOR" window, enter the delegation XPRT token amount. The
                                Balance
                                XPRT is displayed.
                            </li>
                            <li>Optionally, enter your comments or remarks in <b>Memo</b>.</li>
                            <li>Click Submit</li>
                            <li>Enter your wallet <b>Password</b>.</li>
                            <li>Click <b>Submit</b>. A confirmation message appears after the successful delegation of
                                the
                                XPRT token. The transaction hash link is provided. You can click the link and view the
                                transaction details or you can review the delegation details under
                                the <b>Transactions</b> tab.
                            </li>

                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        When do I claim the rewards?
                    </p>
                    <ContextAwareToggle eventKey="13">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="13">
                    <Card.Body><p>You can delegate your XPRT to more than one validator. You can claim rewards from all
                        the validators by using the <b>Claim</b> button that is adjacent to the <b>Rewards</b> in the
                        wallet details or you can claim staking rewards from a single validator transaction: </p>

                        <ul>
                            <li>In the Claiming Rewards window, select Validator.
                            </li>
                            <li>The value of each XPRT token is indicated in USD. The total available XPRT also is
                                displayed.
                            </li>
                            <li>Specify the comments or remarks in <b>Memo</b>.
                            </li>
                            <li>Click <b>Next</b> and enter your <b>Password</b>.</li>
                            <li>Click <b>Submit</b>. Your rewards appear in the wallet details region.</li>
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        How can I redelegate XPRT to another validator?
                    </p>
                    <ContextAwareToggle eventKey="14">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="14">
                    <Card.Body><p>After you delegate your XPRT token with a validator and for some reason, you may want
                        to redelegate the XPRT to another validator, you can redelegate the XPRT by selecting the
                        transaction in the <b>Staking</b> page:</p>
                        <ul>
                            <li>From the <b>Staking</b> page, <b>Active</b> tab, select a validator transaction and
                                click
                                the Actions button.
                            </li>
                            <li>A window appears with the validator name, commission percentage, and actions you can
                                perform. Click <b>Redelegate</b>.
                            </li>
                            <li>In the <b>Redelegating from</b> "VALIDATOR" window, select validator name
                                to <b>Redelegate</b> the XPRT.
                            </li>
                            <li>Enter the <b>Delegation Amount</b>.
                            </li>
                            <li>Enter the <b>Redelegation XPRT Amount</b>.
                            </li>
                            <li>Optionally, enter your comments or remarks in <b>Memo</b>.</li>
                            <li>Click <b>Next</b>.</li>
                            <li>Enter your wallet <b>Password</b>.</li>
                            <li>Click <b>Submit</b>. A confirmation message appears after the successful redelegation of
                                the
                                XPRT token. The transaction hash link is provided. You can click the link and view the
                                transaction details or you can review the delegation details under
                                the <b>Transactions</b> tab.
                            </li>
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Card.Header>
                    <p>
                        How and when can I unbond the XPRT token?
                    </p>
                    <ContextAwareToggle eventKey="15">Click me!</ContextAwareToggle>
                </Card.Header>
                <Accordion.Collapse eventKey="15">
                    <Card.Body><p>After you delegate the XPRT token, they are in the bonding period of 21 days. You can
                        unbond them earlier by selecting the transaction in the <b>Active or Inactive</b> tab of the
                        Staking page.
                    </p>

                        <ul>
                            <li>After selecting the transaction and click Actions .
                            </li>
                            <li>In the validator window click Unbond. Note the commission percentage of the validator.
                            </li>
                            <li>In the <b>Unbond from</b> "VALIDATOR" window, specify <b> Delegation Amount</b>.</li>
                            <li>Enter <b>Unbound XPRT Amount</b> to unbond.</li>
                            <li>Enter a note or remarks in the <b>Memo</b> field.</li>
                            <li>Click Next. If your transaction isn’t eligible for unbonding, then the Next button is
                                dimmed.
                            </li>
                            <li>Enter your password and click <b>Submit</b>. The transaction hash appears and you can
                                find the details when you click the link.
                            </li>
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>

    )
}
export default StakingFaq;