import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import config from "../config.json";
import {stringToPath} from "@cosmjs/crypto";
import {decryptKeyStore} from "./helper";
import Long from "long";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {createProtobufRpcClient} from "@cosmjs/stargate";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import {LedgerSigner} from "@cosmjs/ledger-amino";
import {fee} from "./aminoMsgHelper";
import * as Sentry from "@sentry/browser";
import { ENCRYPTED_MNEMONIC, LOGIN_MODE} from "../constants/localStorage";
import {mnemonicTrim} from "./scripts";

const tendermint_1 = require("cosmjs-types/ibc/lightclients/tendermint/v1/tendermint");
const {SigningStargateClient, QueryClient, setupIbcExtension} = require("@cosmjs/stargate");
const tmRPC = require("@cosmjs/tendermint-rpc");
const {TransferMsg} = require("./protoMsgHelper");
const addressPrefix = config.addressPrefix;
const configChainID = process.env.REACT_APP_CHAIN_ID;
const configCoinType = config.coinType;
const tendermintRPCURL = process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

async function Transaction(wallet, signerAddress, msgs, fee, memo = "") {
    const cosmJS = await SigningStargateClient.connectWithSigner(
        tendermintRPCURL,
        wallet,
    );
    return await cosmJS.signAndBroadcast(signerAddress, msgs, fee, memo);
}

async function TransactionWithKeplr(msgs, fee, memo = "", chainID = configChainID) {
    const [wallet, address] = await KeplrWallet(chainID);
    return Transaction(wallet, address, msgs, fee, memo);
}

async function KeplrWallet(chainID = configChainID) {
    await window.keplr.enable(chainID);
    const offlineSigner = window.getOfflineSigner(chainID);
    const accounts = await offlineSigner.getAccounts();
    return [offlineSigner, accounts[0].address];
}

async function TransactionWithLedger(msgs, fee, memo = "", hdpath = makeHdPath(), prefix = addressPrefix) {
    const [wallet, address] = await LedgerWallet(hdpath, prefix);
    return Transaction(wallet, address, msgs, fee, memo);
}

async function LedgerWallet(hdpath, prefix) {
    const interactiveTimeout = 120_000;

    async function createTransport() {
        const ledgerTransport = await TransportWebUSB.create(interactiveTimeout, interactiveTimeout);
        return ledgerTransport;
    }

    const transport = await createTransport();
    const signer = new LedgerSigner(transport, {
        testModeAllowed: true,
        hdPaths: [hdpath],
        prefix: prefix,
        ledgerAppName:config.persistenceLedgerAppName
    });
    const [firstAccount] = await signer.getAccounts();
    return [signer, firstAccount.address];
}

async function TransactionWithMnemonic(msgs, fee, memo, mnemonic, hdpath = makeHdPath(), bip39Passphrase = "", loginAddress, prefix = addressPrefix) {
    const loginMode = localStorage.getItem(LOGIN_MODE);
    if (loginMode === "normal") {
        const [wallet, address] = await MnemonicWalletWithPassphrase(mnemonic, hdpath, bip39Passphrase, prefix);
        if (address !== loginAddress) {
            throw new Error("Your sign in address and keystore file don’t match. Please try again or else sign in again.");
        }
        return Transaction(wallet, address, msgs, fee, memo);
    } else {
        const [wallet, address] = await LedgerWallet(hdpath, prefix);
        return Transaction(wallet, address, msgs, fee, memo);
    }
}

async function MnemonicWalletWithPassphrase(mnemonic, hdPath = makeHdPath(), password = "", prefix = addressPrefix) {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: prefix,
        bip39Password: password,
        hdPaths: [hdPath]
    });
    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address];
}

function makeHdPath(accountNumber = "0", addressIndex = "0", coinType = configCoinType) {
    return stringToPath("m/44'/" + coinType + "'/" + accountNumber + "'/0/" + addressIndex);
}

function getAccountNumberAndSequence(authResponse) {
    if (authResponse.account["@type"] === "/cosmos.vesting.v1beta1.PeriodicVestingAccount") {
        return [authResponse.account.base_vesting_account.base_account.account_number, authResponse.account.base_vesting_account.base_account.sequence];
    } else if (authResponse.account["@type"] === "/cosmos.vesting.v1beta1.DelayedVestingAccount") {
        return [authResponse.account.base_vesting_account.base_account.account_number, authResponse.account.base_vesting_account.base_account.sequence];
    } else if (authResponse.account["@type"] === "/cosmos.vesting.v1beta1.ContinuousVestingAccount") {
        return [authResponse.account.base_vesting_account.base_account.account_number, authResponse.account.base_vesting_account.base_account.sequence];
    } else if (authResponse.account["@type"] === "/cosmos.auth.v1beta1.BaseAccount") {
        return [authResponse.account.account_number, authResponse.account.sequence];
    } else {
        return [-1, -1];
    }
}

function PrivateKeyReader(file, password, loginAddress, accountNumber = "0", addressIndex = "0",) {
    return new Promise(function (resolve, reject) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = async event => {
            if (event.target.result !== '') {
                const res = JSON.parse(event.target.result);
                const decryptedData = decryptKeyStore(res, password);
                if (decryptedData.error != null) {
                    reject(new Error(decryptedData.error));
                } else {
                    let mnemonic = mnemonicTrim(decryptedData.mnemonic);
                    const accountData = await MnemonicWalletWithPassphrase(mnemonic, makeHdPath(accountNumber, addressIndex));
                    const address = accountData[1];
                    if (address === loginAddress) {
                        resolve(mnemonic);
                        localStorage.setItem(ENCRYPTED_MNEMONIC, event.target.result);
                    } else {
                        reject(new Error("Your sign in address and keystore file don’t match. Please try again or else sign in again."));
                    }
                }
            } else {
                reject(new Error("Invalid File data"));
            }
        };
    });
}

// copied from node_modules/@cosmjs/stargate/build/queries/ibc.js
function decodeTendermintClientStateAny(clientState) {
    if ((clientState === null || clientState === void 0 ? void 0 : clientState.typeUrl) !== "/ibc.lightclients.tendermint.v1.ClientState") {
        throw new Error(`Unexpected client state type: ${clientState === null || clientState === void 0 ? void 0 : clientState.typeUrl}`);
    }
    return tendermint_1.ClientState.decode(clientState.value);
}

// copied from node_modules/@cosmjs/stargate/build/queries/ibc.js
function decodeTendermintConsensusStateAny(consensusState) {
    if ((consensusState === null || consensusState === void 0 ? void 0 : consensusState.typeUrl) !== "/ibc.lightclients.tendermint.v1.ConsensusState") {
        throw new Error(`Unexpected client state type: ${consensusState === null || consensusState === void 0 ? void 0 : consensusState.typeUrl}`);
    }
    return tendermint_1.ConsensusState.decode(consensusState.value);
}

async function MakeIBCTransferMsg(channel, fromAddress, toAddress, amount, timeoutHeight, timeoutTimestamp = config.timeoutTimestamp, denom = config.coinDenom, url, port = "transfer") {
    const tendermintClient = await tmRPC.Tendermint34Client.connect(tendermintRPCURL);
    const queryClient = new QueryClient(tendermintClient);

    const ibcExtension = setupIbcExtension(queryClient);

    const finalResponse = await ibcExtension.ibc.channel.clientState(port, channel).then(async (clientStateResponse) => {
        const clientStateResponseDecoded = decodeTendermintClientStateAny(clientStateResponse.identifiedClientState.clientState);
        timeoutHeight = {
            revisionHeight: clientStateResponseDecoded.latestHeight.revisionHeight.add(config.ibcRevisionHeightIncrement),
            revisionNumber: clientStateResponseDecoded.latestHeight.revisionNumber
        };
        if (url === undefined) {
            const consensusStateResponse = await ibcExtension.ibc.channel.consensusState(port, channel,
                clientStateResponseDecoded.latestHeight.revisionNumber.toInt(), clientStateResponseDecoded.latestHeight.revisionHeight.toInt());
            const consensusStateResponseDecoded = decodeTendermintConsensusStateAny(consensusStateResponse.consensusState);

            const timeoutTime = Long.fromNumber(consensusStateResponseDecoded.timestamp.getTime() / 1000).add(timeoutTimestamp).multiply(1000000000); //get time in nanoesconds
            return TransferMsg(channel, fromAddress, toAddress, amount, timeoutHeight, timeoutTime, denom, port);
        } else {
            const remoteTendermintClient = await tmRPC.Tendermint34Client.connect(url);
            const latestBlockHeight = (await remoteTendermintClient.status()).syncInfo.latestBlockHeight;
            timeoutHeight.revisionHeight = Long.fromNumber(latestBlockHeight).add(config.ibcRemoteHeightIncrement);
            const timeoutTime = Long.fromNumber(0);
            return TransferMsg(channel, fromAddress, toAddress, amount, timeoutHeight, timeoutTime, denom, port);
        }
    }).catch(error => {
        Sentry.captureException(error.response
            ? error.response.data.message
            : error.message);
        throw error;
    });
    return finalResponse;
}

async function RpcClient() {
    const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
    const queryClient = new QueryClient(tendermintClient);
    return createProtobufRpcClient(queryClient);
}


async function getTransactionResponse(address, data, feeAmount, gas, mnemonic = "", txName, accountNumber = 0, addressIndex = 0, bip39Passphrase = "") {
    switch (txName) {
    case "send":
        return TransactionWithMnemonic(data.message, fee(Math.trunc(feeAmount), gas), data.memo,
            mnemonic, makeHdPath(accountNumber, addressIndex), bip39Passphrase, address);
    case "delegate":
        return TransactionWithMnemonic(data.message, fee(Math.trunc(feeAmount), gas), data.memo,
            mnemonic, makeHdPath(accountNumber, addressIndex), bip39Passphrase, address);
    case "withdrawMultiple":
        return TransactionWithMnemonic(data.message, fee(Math.trunc(feeAmount), gas), data.memo,
            mnemonic, makeHdPath(accountNumber, addressIndex), bip39Passphrase, address);
    case "withdrawAddress":
        return TransactionWithMnemonic(data.message, fee(Math.trunc(feeAmount), gas), data.memo,
            mnemonic, makeHdPath(accountNumber, addressIndex), bip39Passphrase, address);
    case "reDelegate":
        return TransactionWithMnemonic(data.message, fee(Math.trunc(feeAmount), gas), data.memo,
            mnemonic, makeHdPath(accountNumber, addressIndex), bip39Passphrase, address);
    case  "unbond":
        return TransactionWithMnemonic(data.message, fee(Math.trunc(feeAmount), gas), data.memo,
            mnemonic, makeHdPath(accountNumber, addressIndex), bip39Passphrase, address);
    case "withdrawValidatorRewards":
        return TransactionWithMnemonic(data.message, fee(Math.trunc(feeAmount), gas), data.memo,
            mnemonic, makeHdPath(accountNumber, addressIndex), bip39Passphrase, address);
    case "ibc":
        return TransactionWithMnemonic(data.message,
            fee(Math.trunc(feeAmount), gas), data.memo, mnemonic,
            makeHdPath(accountNumber, addressIndex), bip39Passphrase, address);
    }
    
}


export default {
    TransactionWithKeplr,
    TransactionWithMnemonic,
    TransactionWithLedger,
    makeHdPath,
    getAccountNumberAndSequence,
    PrivateKeyReader,
    MakeIBCTransferMsg,
    RpcClient,
    getTransactionResponse,
    LedgerWallet,
    MnemonicWalletWithPassphrase,
};
