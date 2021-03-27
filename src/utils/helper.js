import {MsgSend} from "@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx";
import {MsgBeginRedelegate, MsgDelegate, MsgUndelegate} from "@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx";
import {MsgWithdrawDelegatorReward} from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/tx";

const crypto = require("crypto");
const passwordHashAlgorithm = "sha512";

function randomNum(min, max) {
    let randomNumbers = [];
    for (var i = 0; i < 3; i++) {
        var random_number = Math.floor(Math.random() * (max - min) + min);
        if (randomNumbers.indexOf(random_number) == -1) {
            randomNumbers.push(random_number);
        }

    }
    return randomNumbers;
}

function stringTruncate(str) {
    if (str.length > 30) {
        return str.substr(0, 10) + '...' + str.substr(str.length - 10, str.length);
    }
    return str;
}

function createStore(mnemonic, password) {
    try {
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
        let encrypted = cipher.update(mnemonic);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        let obj = {
            "hashpwd": crypto.createHash(passwordHashAlgorithm).update(password).digest("hex"),
            "iv": iv.toString("hex"),
            "salt": key.toString("hex"),
            "crypted": encrypted.toString("hex")
        }
        return {
            Response: obj
        };
    } catch (exception) {
        return {
            success: false,
            error: exception.message
        };
    }
}

function decryptStore(fileData, password) {
    let hashpwd = fileData.hashpwd
    let iv = fileData.iv
    let salt = fileData.salt
    let crypted = fileData.crypted

    if (hashpwd === crypto.createHash(passwordHashAlgorithm).update(password).digest("hex")) {
        let ivText = Buffer.from(iv, "hex");
        let encryptedText = Buffer.from(crypted, "hex");

        let decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            Buffer.from(salt, "hex"),
            ivText
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return {
            mnemonic: decrypted.toString(),
        };
    } else {
        return {
            error: "Incorrect password."
        };
    }
}

function isActive(item) {
    return item.jailed === false && item.status === 'BOND_STATUS_BONDED';
}

function ValidateFrom(value) {
    if (value.length === 0) {
        return new Error('Length must be greater than 0');
    }
    return new Error('');
}

function ValidatePassphrase(value) {
    if (value.length === 50) {
        return true;
    }
    return false;
}

function sendMsg(amount, fromAddress, toAddress) {
    return {
        type: "cosmos-sdk/MsgSend",
        value: {
            amount: [
                {
                    amount: String(amount),
                    denom: "uxprt"
                }
            ],
            from_address: fromAddress,
            to_address: toAddress
        }
    }
}

function msgs(...msg) {
    return msg
}

function fee(amount, gas = 250000) {
    return {amount: [{amount: String(amount), denom: "upxrt"}], gas: String(gas)}
}

function delegateMsg(amount, address, validatorAddress) {
    return {
        type: "cosmos-sdk/MsgDelegate",
        value: {
            amount: {
                amount: String(amount),
                denom: "uxprt"
            },
            delegator_address: address,
            validator_address: validatorAddress
        }
    }
}

function redelegateMsg(amount, address, validatorAddress, toValidatorAddress) {
    return {
        type: "cosmos-sdk/MsgBeginRedelegate",
        value: {
            amount: {
                amount: String(amount),
                denom: "uxprt"
            },
            delegator_address: address,
            validator_dst_address: toValidatorAddress,
            validator_src_address: validatorAddress
        }
    }
}

function unBondMsg(amount, address, validatorAddress) {
    return {
        type: "cosmos-sdk/MsgUndelegate",
        value: {
            amount: {
                amount: String(amount),
                denom: "uxprt"
            },
            delegator_address: address,
            validator_address: validatorAddress
        }
    }
}

function withDrawMsg(address, validatorAddress) {
    return {
        type: "cosmos-sdk/MsgWithdrawDelegationReward",
        value: {
            delegator_address: address,
            validator_address: validatorAddress
        }
    }
}

//stargate msgs and urls
const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend"
const msgDelegateTypeUrl = "/cosmos.staking.v1beta1.MsgDelegate"
const msgRedelegateTypeUrl = "/cosmos.staking.v1beta1.MsgBeginRedelegate"
const msgUnbondTypeUrl = "/cosmos.staking.v1beta1.MsgUndelegate"
const msgWithdrawRewardsTypeUrl = "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"

function msgSend(fromAddress, toAddress, amount) {
    return {
        typeUrl: msgSendTypeUrl,
        value: MsgSend.fromPartial({
            fromAddress: fromAddress,
            toAddress: toAddress,
            amount: [{
                denom: "uxprt",
                amount: String(amount),
            }],
        }),
    };
}

function msgDelegate(delegatorAddress, validatorAddress, amount) {
    return {
        typeUrl: msgDelegateTypeUrl,
        value: MsgDelegate.fromPartial({
                delegatorAddress: delegatorAddress,
                validatorAddress: validatorAddress,
                amount: {
                    denom: "uxprt",
                    amount: String(amount),
                },
            }
        ),
    };
}

function msgRedelegate(delegatorAddress, validatorSrcAddress, validatorDstAddress, amount) {
    return {
        typeUrl: msgRedelegateTypeUrl,
        value: MsgBeginRedelegate.fromPartial({
                delegatorAddress: delegatorAddress,
                validatorSrcAddress: validatorSrcAddress,
                validatorDstAddress: validatorDstAddress,
                amount: {
                    denom: "uxprt",
                    amount: String(amount),
                },
            }
        ),
    };
}

function msgUnbond(delegatorAddress, validatorAddress, amount) {
    return {
        typeUrl: msgUnbondTypeUrl,
        value: MsgUndelegate.fromPartial({
                delegatorAddress: delegatorAddress,
                validatorAddress: validatorAddress,
                amount: {
                    denom: "uxprt",
                    amount: String(amount),
                },
            }
        ),
    };

}

function msgWithdraw(delegatorAddress, validatorAddress) {
    return {
        typeUrl: msgWithdrawRewardsTypeUrl,
        value: MsgWithdrawDelegatorReward.fromPartial({
            delegatorAddress: delegatorAddress,
            validatorAddress: validatorAddress,
        }),
    };
}
//stargate end

module.exports = {
    randomNum,
    stringTruncate,
    createStore,
    decryptStore,
    isActive,
    ValidateFrom,
    ValidatePassphrase,
    sendMsg,
    msgs,
    fee,
    delegateMsg,
    reDelegateMsg: redelegateMsg,
    unBondMsg,
    withDrawMsg
};