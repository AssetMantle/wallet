import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";
import {MsgGrant} from "cosmjs-types/cosmos/authz/v1beta1/tx";
import {MsgBeginRedelegate, MsgDelegate, MsgUndelegate} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import {
    MsgSetWithdrawAddress,
    MsgWithdrawDelegatorReward,
    MsgWithdrawValidatorCommission
} from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import {MsgTransfer} from "cosmjs-types/ibc/applications/transfer/v1/tx";
import {coin} from "@cosmjs/stargate";
import helper from "./helper";
import config from "../config";
import {Any} from "cosmjs-types/google/protobuf/any";
import {GenericAuthorization, Grant} from "cosmjs-types/cosmos/authz/v1beta1/authz";

const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend";
const msgGrantTypeUrl = "/cosmos.authz.v1beta1.MsgGrant";
const msgDelegateTypeUrl = "/cosmos.staking.v1beta1.MsgDelegate";
const msgRedelegateTypeUrl = "/cosmos.staking.v1beta1.MsgBeginRedelegate";
const msgUnbondTypeUrl = "/cosmos.staking.v1beta1.MsgUndelegate";
const msgWithdrawRewardsTypeUrl = "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";
const msgSetWithdrawAddressTypeUrl = "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress";
const msgTransferTypeUrl = "/ibc.applications.transfer.v1.MsgTransfer";
const msgValidatorCommission = '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission';

function SendMsg(fromAddress, toAddress, amount, denom) {
    return {
        typeUrl: msgSendTypeUrl,
        value: MsgSend.fromPartial({
            fromAddress: helper.trimWhiteSpaces(fromAddress),
            toAddress: helper.trimWhiteSpaces(toAddress),
            amount: [{
                denom: denom,
                amount: String(amount),
            }],
        }),
    };
}

function GrantMsg(granterAddress, granteeAddress) {
    return {
        typeUrl: msgGrantTypeUrl,
        value: MsgGrant.fromPartial({
            granter:granterAddress,
            grantee:granteeAddress,
            grant: Grant.fromPartial({
                authorization: Any.fromPartial({
                    typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
                    value: Uint8Array.from(GenericAuthorization.encode(GenericAuthorization.fromJSON({msg: "/cosmos.gov.v1beta1.MsgVote"})).finish())}),
                expiration: {
                    seconds: '1642586850',
                    nanos: 12232
                }
            })
        })
    };
}

function DelegateMsg(delegatorAddress, validatorAddress, amount, denom = config.coinDenom) {
    return {
        typeUrl: msgDelegateTypeUrl,
        value: MsgDelegate.fromPartial({
            delegatorAddress: delegatorAddress,
            validatorAddress: validatorAddress,
            amount: {
                denom: denom,
                amount: String(amount),
            },
        }
        ),
    };
}

function RedelegateMsg(delegatorAddress, validatorSrcAddress, validatorDstAddress, amount) {
    return {
        typeUrl: msgRedelegateTypeUrl,
        value: MsgBeginRedelegate.fromPartial({
            delegatorAddress: delegatorAddress,
            validatorSrcAddress: validatorSrcAddress,
            validatorDstAddress: validatorDstAddress,
            amount: {
                denom: config.coinDenom,
                amount: String(amount),
            },
        }
        ),
    };
}

function UnbondMsg(delegatorAddress, validatorAddress, amount) {
    return {
        typeUrl: msgUnbondTypeUrl,
        value: MsgUndelegate.fromPartial({
            delegatorAddress: delegatorAddress,
            validatorAddress: validatorAddress,
            amount: {
                denom: config.coinDenom,
                amount: String(amount),
            },
        }
        ),
    };

}

function WithdrawMsg(delegatorAddress, validatorAddress) {
    return {
        typeUrl: msgWithdrawRewardsTypeUrl,
        value: MsgWithdrawDelegatorReward.fromPartial({
            delegatorAddress: delegatorAddress,
            validatorAddress: validatorAddress,
        }),
    };
}

function SetWithDrawAddressMsg(delegatorAddress, withdrawAddress) {
    return {
        typeUrl: msgSetWithdrawAddressTypeUrl,
        value: MsgSetWithdrawAddress.fromPartial({
            delegatorAddress: delegatorAddress,
            withdrawAddress: helper.trimWhiteSpaces(withdrawAddress),
        }),
    };
}

function TransferMsg(channel, fromAddress, toAddress, amount, timeoutHeight, timeoutTimestamp, denom, port = "transfer") {
    return {
        typeUrl: msgTransferTypeUrl,
        value: MsgTransfer.fromPartial({
            sourcePort: port,
            sourceChannel: channel,
            token: coin(helper.stringToNumber(amount), denom),
            sender: helper.trimWhiteSpaces(fromAddress),
            receiver: helper.trimWhiteSpaces(toAddress),
            timeoutHeight: {
                revisionNumber: timeoutHeight.revisionNumber,
                revisionHeight: timeoutHeight.revisionHeight,
            },
            timeoutTimestamp: timeoutTimestamp,
        }),
    };
}

function ValidatorCommissionMsg(address) {
    return {
        typeUrl: msgValidatorCommission,
        value: MsgWithdrawValidatorCommission.fromPartial({
            validatorAddress: address,
        }),
    };
}

export {
    SendMsg,
    DelegateMsg,
    RedelegateMsg,
    UnbondMsg,
    WithdrawMsg,
    SetWithDrawAddressMsg,
    TransferMsg,
    ValidatorCommissionMsg,
    GrantMsg
};
