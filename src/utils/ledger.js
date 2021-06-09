import {
    coins,
} from "@cosmjs/amino";
import {
    assertIsBroadcastTxSuccess as assertIsBroadcastTxSuccessStargate,
    SigningStargateClient,
} from "@cosmjs/stargate";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import {LedgerSigner} from "@cosmjs/ledger-amino";
import {makeHdPath} from "./transactions";
import {SendMsg} from "./protoMsgHelper";

const RPCURL = process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

const interactiveTimeout = 120_000;

export async function createTransport() {
    const ledgerTransport = await TransportWebUSB.create(interactiveTimeout, interactiveTimeout);
    return ledgerTransport;
}

export const fetchAddress = async (transport) => {
    const signer = new LedgerSigner(transport, {
        testModeAllowed: true,
        hdPaths: [makeHdPath()],
        prefix: "persistence"
    });
    const [firstAccount] = await signer.getAccounts();
    return firstAccount.address;
};


// eslint-disable-next-line no-unused-vars
export const doTx = async (transport) => {
    transport = await createTransport();
    console.log(transport);
    const signer = new LedgerSigner(transport, {
        hdPaths: [makeHdPath()],
        prefix: "persistence"
    });
    const [firstAccount] = await signer.getAccounts();
    console.log(firstAccount, "address", "persistence18qr36nfyhferhpl6alwa8pdvxt4pr5g5jetv82");
    const client = await SigningStargateClient.connectWithSigner(RPCURL, signer);
    const fee = {
        amount: coins(100, "uxprt"),
        gas: String(2000000)
    };

    const result = await client.signAndBroadcast(
        firstAccount.address,
        [SendMsg(firstAccount.address,"persistence18qr36nfyhferhpl6alwa8pdvxt4pr5g5jetv82",1221,"uxprt" )],fee,"ledger Tx",
    );
    assertIsBroadcastTxSuccessStargate(result);
    console.log(result, "final result ");
};
