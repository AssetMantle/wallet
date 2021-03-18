import React, {Component} from 'react';
import {CosmosClient, makeSignDoc, makeStdTx, Secp256k1HdWallet} from "@cosmjs/launchpad";
import {makeCosmoshubPath} from "../utils/cosmosPath"
import './index.css'

class Send extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signResult: {}
        }
        this.sign = this.sign.bind(this);
    }


    async sign() {
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
                to_address: address,
                amount: [
                    {
                        denom: "xprt",
                        amount: "100",
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
        this.setState({
            signResult: broadcastResult
        })
    }

    render() {
        return (
            <div className="cosmjs">
                <div className="cosmjs_header">
                    COSMJS SignedTx
                </div>
                <div>
                    <button className="cosmjs_button" onClick={() => this.sign()}>
                        Click to Sign with CosmJs
                    </button>
                    <div className="cosmjs_res">
                        {
                            this.state.signResult && this.state.signResult.logs ? 'success' : ''
                        }
                    </div>
                    {
                        this.state.signResult && this.state.signResult.logs &&
                        <div className="tx_hash_cosmjs">
                            <span> Transaction Hash : {"  "}</span>
                            <span>{" "} {this.state.signResult.transactionHash}</span>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Send;