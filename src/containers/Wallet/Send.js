import React, {useState} from "react";
import {Form, Modal} from "react-bootstrap";
import {CosmosClient, makeSignDoc, makeStdTx, Secp256k1HdWallet} from "@cosmjs/launchpad";
import {makeCosmoshubPath} from "../../utils/cosmosPath";

const Send = () => {
    const [amountField, setAmountField] = useState(0);
    const handleAmount = (amount) =>{
        setAmountField(amount)
    }
    const handleAmountChange = (evt) =>{
        setAmountField(evt.target.value)
    }
    const handleSubmit = async event => {
        event.preventDefault()
        const toAddress = event.target.address.value;
        const apiUrl = "http://128.199.29.15:1317";

        const mnemonic = "tank pair spray rely any menu airport shiver boost emerge holiday siege evil grace exile comfort fence mention pig bus cable scissors ability all";

        const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, makeCosmoshubPath(0), "persistence");
        const [{address}] = await wallet.getAccounts();

        const client = new CosmosClient(apiUrl);
        const {accountNumber, sequence} = await client.getSequence(address);

        const defaultNetworkId = "persistence";
        const defaultFee = {
            amount: [
                {
                    amount: "5000",
                    denom: "xprt",
                },
            ],
            gas: "2000000",
        };

        const sendTokensMsg = {
            type: "cosmos-sdk/MsgSend",
            value: {
                from_address: address,
                to_address: toAddress,
                amount: [
                    {
                        denom: "xprt",
                        amount: amountField,
                    },
                ],
            },
        };

        const signDoc = makeSignDoc(
            [sendTokensMsg],
            defaultFee,
            defaultNetworkId,
            "My first contract on chain",
            accountNumber,
            sequence,
        );

        const {signed, signature} = await wallet.sign(address, signDoc);
        const signedTx = makeStdTx(signed, signature);

        let broadcastResult = await client.broadcastTx(signedTx);
      console.log("raju",broadcastResult)
    }
    return (
        <div className="send-container">
            <div className="form-section">
                <Form  onSubmit={handleSubmit}>
                    <div className="form-field">
                        <p className="label">Recipient Address</p>
                        <Form.Control
                            type="text"
                            name="address"
                            placeholder="Enter recipient address"
                            required={true}
                        />
                    </div>
                    <div className="form-field">
                        <p className="label">Send Amount</p>
                        <div className="amount-field">
                            <Form.Control
                                type="text"
                                name="amount"
                                placeholder="Send Amount"
                                value={amountField}
                                onChange={handleAmountChange}
                                required={true}
                            />
                            <div className="range-buttons">
                                <button type="button" className="button button-range" onClick={()=>handleAmount(25000000)}>25%</button>
                                <button type="button" className="button button-range" onClick={()=>handleAmount(50000000)}>50%</button>
                                <button type="button" className="button button-range" onClick={()=>handleAmount(75000000)}>75%</button>
                                <button type="button" className="button button-range" onClick={()=>handleAmount(100000000)}>Max</button>
                            </div>
                        </div>
                    </div>
                    <div className="form-field">
                        <p className="label">Memo</p>
                        <Form.Control
                            type="text"
                            name="memo"
                            placeholder="Insert memo (optional)"
                            required={false}
                        />
                    </div>
                    <div className="buttons">
                        <button className="button button-primary">Send</button>
                    </div>
                </Form>
            </div>
        </div>
    );
};
export default Send;