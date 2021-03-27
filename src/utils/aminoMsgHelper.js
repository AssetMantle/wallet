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

module.exports = {
    sendMsg,
    msgs,
    fee,
    delegateMsg,
    reDelegateMsg: redelegateMsg,
    unBondMsg,
    withDrawMsg
};