import {
    makeCosmoshubPath,
    coins,
} from "@cosmjs/amino";
import {
    assertIsBroadcastTxSuccess as assertIsBroadcastTxSuccessStargate,
    SigningStargateClient,
} from "@cosmjs/stargate";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { LedgerSigner } from "@cosmjs/ledger-amino/build/ledgersigner";
const RPCURL =  process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

export const createUSB = async () => {
    let transpt = null;
    try {
        transpt = await TransportWebUSB.create();
        console.log("transport for createUSB(): ", transpt);
        let response = await onSelectDevice(transpt);
        return response;
    } catch (e) {
        console.log("Error while createUSB: ", e);
    }
};

const onSelectDevice = async (transpt) => {
    try {
        window.ledgerTransport = transpt;
        console.log("transport for onSelectDevice(): ", transpt);
        transpt.on("disconnect", () => {
            console.log("transport disconnected!!");
        });
        console.log("transport connected!!");
    } catch (e) {
        console.log("Error while Selecting Device: ", e);
    }
    let response = await fetchAddress(transpt);
    return response;
};

const fetchAddress = async (transport) =>{
    const defaultLedgerAddress = "cosmos1p6xs63q4g7np99ttv5nd3yzkt8n4qxa47w8aea";
    const signer = new LedgerSigner(transport, {
        testModeAllowed: true,
        hdPaths: [makeCosmoshubPath(0), makeCosmoshubPath(1), makeCosmoshubPath(10)],
    });
    const [firstAccount] = await signer.getAccounts();
    console.log(firstAccount, "address");
    const client = await SigningStargateClient.connectWithSigner(RPCURL, signer);
    const result = await client.sendTokens(
        firstAccount.address,
        defaultLedgerAddress,
        coins(1234, "ustake"),
    );
    assertIsBroadcastTxSuccessStargate(result);
    console.log(result , "final result ");
};
