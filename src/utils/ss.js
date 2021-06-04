import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import {Cosmos} from "ledger-app-cosmos";
import {Base64} from "js-base64";
import {
    CoinDenom,
    FEE_AMOUNT,
    GAS,
    HRP,
    REACT_APP_API_KEY,
    REACT_APP_CHAIN_ID,
    ToAddress
} from "../../constants/account";
import {toast} from "react-toastify";

const configChainID = REACT_APP_CHAIN_ID
const toAddress = ToAddress
const gas = GAS;
const denom = CoinDenom;
const hrp = HRP;
const feeAmount = FEE_AMOUNT;

export const createUSB = async (uAtoms) => {
    let transpt = null;
    try {
        transpt = await TransportWebUSB.create();
        console.log("transport for createUSB(): ", transpt)
        let response = await onSelectDevice(uAtoms, transpt);
        return response;
    } catch (e) {
        console.log("Error while createUSB: ", e)
    }
};

const onSelectDevice = async (uAtoms, transpt) => {
    try {
        window.ledgerTransport = transpt;
        console.log("transport for onSelectDevice(): ", transpt)
        transpt.on("disconnect", () => {
            console.log("transport disconnected!!")
            toast.info(
                `Transport disconnected`,
                {
                    position: toast.POSITION.BOTTOM_CENTER,
                }
            );
        });
        console.log("transport connected!!")
    } catch (e) {
        console.log("Error while Selecting Device: ", e)
    }
    let response = await fetchAddress(uAtoms, transpt);
    return response;
};

const fetchAddress = async (uAtoms, transpt) => {
    try {
        const cosmos = new Cosmos(transpt);
        // const path = "44'/60'/0'/0/0"; // HD derivation path
        const path = [44, 118, 0, 0, 0];
        const r = await cosmos.getAddressAndPublicKey(path, hrp);
        const ledgAddress = r.bech32_address;
        console.log("transport: ", transpt)
        console.log("ledger address: ", ledgAddress)

        let data = await getAccounts(ledgAddress);

        let stdMsg = ({
            msgs: [
                {
                    type: "cosmos-sdk/MsgSend",
                    value: {
                        amount: [
                            {
                                amount: String(uAtoms * 1000000), 	// 6 decimal places (1000000 uatom = 1 ATOM)
                                denom: denom
                            }
                        ],
                        from_address: ledgAddress,
                        to_address: toAddress
                    }
                }
            ],
            chain_id: configChainID,
            fee: {amount: [{amount: String(feeAmount), denom: denom}], gas: String(gas)},
            memo: "",
            account_number: String(data.account.account_number),
            sequence: String(data.account.sequence)
        });

        console.log("Compressed keys ", r.compressed_pk)

        cosmos.sign(path, stdMsg)
            .then(function (signed) {
                console.log("signed tx: ", signed);
                if (signed && signed.error_message && signed.error_message.indexOf("No errors") !== -1) {
                    toast.info(
                        `Transaction signed. Now broadcasting!`,
                        {
                            position: toast.POSITION.BOTTOM_CENTER,
                        }
                    );
                    let sig = Base64.fromUint8Array(signed.signature)
                    let publicKey = Buffer.from(r.compressed_pk, 'binary').toString('base64');

                    stdMsg["signatures"] = [
                        {
                            "pub_key": {
                                "type": "tendermint/PubKeySecp256k1",
                                "value": publicKey,
                            },
                            "signature": sig
                        }
                    ];

                    broadcast(stdMsg)
                        .then(response => {
                            console.log("response from broadcast", response);
                            if (response && response.raw_log && response.raw_log.indexOf("insufficient funds") !== -1) {
                                toast.info(
                                    "Insufficient funds!",
                                    {
                                        position: toast.POSITION.BOTTOM_CENTER,
                                    }
                                );
                            } else if (response && response.raw_log && response.raw_log.indexOf("events") !== -1) {
                                toast.info(
                                    `Transaction broadcasted!`,
                                    {
                                        position: toast.POSITION.BOTTOM_CENTER,
                                    }
                                );
                            } else {
                                toast.info(
                                    `Error while broadcasting transaction!`,
                                    {
                                        position: toast.POSITION.BOTTOM_CENTER,
                                    }
                                );
                            }
                            return response;
                        });
                } else if (signed && signed.error_message && signed.error_message.indexOf("Transaction rejected") !== -1) {
                    toast.info(
                        `Transaction rejected by user!`,
                        {
                            position: toast.POSITION.BOTTOM_CENTER,
                        }
                    );
                    return "Transaction rejected"
                }
            })
            .catch(function (error) {
                console.error(error);
            })


    } catch (error) {
        // in this case, user is likely not on cosmos app
        console.log("Failed to fetchAddress: " + error.message);
        return null;
    }
};

const getAccounts = (ledgrAddress) => {
    let accountsAPI = "";
    try {
        if (configChainID.indexOf("cosmos") !== -1) {
            accountsAPI = "/cosmos/auth/v1beta1/accounts/";
        } else if (configChainID.indexOf("stargate-final") !== -1) {
            accountsAPI = "/cosmos/auth/v1beta1/accounts/";
        } else if (configChainID.indexOf("bifrost") !== -1) {
            accountsAPI = "/cosmos/auth/v1beta1/accounts/";
        } else if (configChainID.indexOf("irishub") !== -1) {
            accountsAPI = "/cosmos/auth/v1beta1/accounts/";
        } else if (configChainID.indexOf("akash") !== -1) {
            accountsAPI = "/cosmos/auth/v1beta1/accounts/";
        } else if (configChainID.indexOf("edgenet") !== -1) {
            accountsAPI = "/cosmos/auth/v1beta1/accounts/";
        } else if (configChainID.indexOf("core-1") !== -1) {
            accountsAPI = "/cosmos/auth/v1beta1/accounts/";
        } else {
            accountsAPI = "/auth/accounts/";
        }
        return fetch(REACT_APP_API_KEY + accountsAPI + ledgrAddress)
            .then(response => response.json())
    } catch (e) {
        console.log("Error while getting accounts: ", e)
    }
}

const broadcast = (signedTx) => {
    let broadcastAPI = "/txs";
    try {
        let broadcastTx = {
            "tx": {
                msg: signedTx.msgs, //legder requires msgs, but broadcast requires msg.
                fee: signedTx.fee,
                signatures: signedTx.signatures,
                memo: signedTx.memo,
            },
            "mode": "block"
        }
        console.log("broadcastTx input : ", broadcastTx)
        return fetch(REACT_APP_API_KEY + broadcastAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(broadcastTx)
        })
            .then(response => response.json())
    } catch (e) {
        console.log("Error while broadcasting in ledger: ", e)
    }
}