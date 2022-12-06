import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgValsetConfirm, MsgSendToEth, MsgRequestBatch, MsgConfirmBatch, MsgConfirmLogicCall, MsgSendToCosmosClaim, MsgExecuteIbcAutoForwards, MsgBatchSendToEthClaim, MsgValsetUpdatedClaim, MsgERC20DeployedClaim, MsgLogicCallExecutedClaim, MsgSetOrchestratorAddress, MsgCancelSendToEth, MsgSubmitBadSignatureEvidence } from "./msgs";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/gravity.v1.MsgValsetConfirm", MsgValsetConfirm], ["/gravity.v1.MsgSendToEth", MsgSendToEth], ["/gravity.v1.MsgRequestBatch", MsgRequestBatch], ["/gravity.v1.MsgConfirmBatch", MsgConfirmBatch], ["/gravity.v1.MsgConfirmLogicCall", MsgConfirmLogicCall], ["/gravity.v1.MsgSendToCosmosClaim", MsgSendToCosmosClaim], ["/gravity.v1.MsgExecuteIbcAutoForwards", MsgExecuteIbcAutoForwards], ["/gravity.v1.MsgBatchSendToEthClaim", MsgBatchSendToEthClaim], ["/gravity.v1.MsgValsetUpdatedClaim", MsgValsetUpdatedClaim], ["/gravity.v1.MsgERC20DeployedClaim", MsgERC20DeployedClaim], ["/gravity.v1.MsgLogicCallExecutedClaim", MsgLogicCallExecutedClaim], ["/gravity.v1.MsgSetOrchestratorAddress", MsgSetOrchestratorAddress], ["/gravity.v1.MsgCancelSendToEth", MsgCancelSendToEth], ["/gravity.v1.MsgSubmitBadSignatureEvidence", MsgSubmitBadSignatureEvidence]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    valsetConfirm(value: MsgValsetConfirm) {
      return {
        typeUrl: "/gravity.v1.MsgValsetConfirm",
        value: MsgValsetConfirm.encode(value).finish()
      };
    },

    sendToEth(value: MsgSendToEth) {
      return {
        typeUrl: "/gravity.v1.MsgSendToEth",
        value: MsgSendToEth.encode(value).finish()
      };
    },

    requestBatch(value: MsgRequestBatch) {
      return {
        typeUrl: "/gravity.v1.MsgRequestBatch",
        value: MsgRequestBatch.encode(value).finish()
      };
    },

    confirmBatch(value: MsgConfirmBatch) {
      return {
        typeUrl: "/gravity.v1.MsgConfirmBatch",
        value: MsgConfirmBatch.encode(value).finish()
      };
    },

    confirmLogicCall(value: MsgConfirmLogicCall) {
      return {
        typeUrl: "/gravity.v1.MsgConfirmLogicCall",
        value: MsgConfirmLogicCall.encode(value).finish()
      };
    },

    sendToCosmosClaim(value: MsgSendToCosmosClaim) {
      return {
        typeUrl: "/gravity.v1.MsgSendToCosmosClaim",
        value: MsgSendToCosmosClaim.encode(value).finish()
      };
    },

    executeIbcAutoForwards(value: MsgExecuteIbcAutoForwards) {
      return {
        typeUrl: "/gravity.v1.MsgExecuteIbcAutoForwards",
        value: MsgExecuteIbcAutoForwards.encode(value).finish()
      };
    },

    batchSendToEthClaim(value: MsgBatchSendToEthClaim) {
      return {
        typeUrl: "/gravity.v1.MsgBatchSendToEthClaim",
        value: MsgBatchSendToEthClaim.encode(value).finish()
      };
    },

    valsetUpdateClaim(value: MsgValsetUpdatedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgValsetUpdatedClaim",
        value: MsgValsetUpdatedClaim.encode(value).finish()
      };
    },

    eRC20DeployedClaim(value: MsgERC20DeployedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgERC20DeployedClaim",
        value: MsgERC20DeployedClaim.encode(value).finish()
      };
    },

    logicCallExecutedClaim(value: MsgLogicCallExecutedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgLogicCallExecutedClaim",
        value: MsgLogicCallExecutedClaim.encode(value).finish()
      };
    },

    setOrchestratorAddress(value: MsgSetOrchestratorAddress) {
      return {
        typeUrl: "/gravity.v1.MsgSetOrchestratorAddress",
        value: MsgSetOrchestratorAddress.encode(value).finish()
      };
    },

    cancelSendToEth(value: MsgCancelSendToEth) {
      return {
        typeUrl: "/gravity.v1.MsgCancelSendToEth",
        value: MsgCancelSendToEth.encode(value).finish()
      };
    },

    submitBadSignatureEvidence(value: MsgSubmitBadSignatureEvidence) {
      return {
        typeUrl: "/gravity.v1.MsgSubmitBadSignatureEvidence",
        value: MsgSubmitBadSignatureEvidence.encode(value).finish()
      };
    }

  },
  withTypeUrl: {
    valsetConfirm(value: MsgValsetConfirm) {
      return {
        typeUrl: "/gravity.v1.MsgValsetConfirm",
        value
      };
    },

    sendToEth(value: MsgSendToEth) {
      return {
        typeUrl: "/gravity.v1.MsgSendToEth",
        value
      };
    },

    requestBatch(value: MsgRequestBatch) {
      return {
        typeUrl: "/gravity.v1.MsgRequestBatch",
        value
      };
    },

    confirmBatch(value: MsgConfirmBatch) {
      return {
        typeUrl: "/gravity.v1.MsgConfirmBatch",
        value
      };
    },

    confirmLogicCall(value: MsgConfirmLogicCall) {
      return {
        typeUrl: "/gravity.v1.MsgConfirmLogicCall",
        value
      };
    },

    sendToCosmosClaim(value: MsgSendToCosmosClaim) {
      return {
        typeUrl: "/gravity.v1.MsgSendToCosmosClaim",
        value
      };
    },

    executeIbcAutoForwards(value: MsgExecuteIbcAutoForwards) {
      return {
        typeUrl: "/gravity.v1.MsgExecuteIbcAutoForwards",
        value
      };
    },

    batchSendToEthClaim(value: MsgBatchSendToEthClaim) {
      return {
        typeUrl: "/gravity.v1.MsgBatchSendToEthClaim",
        value
      };
    },

    valsetUpdateClaim(value: MsgValsetUpdatedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgValsetUpdatedClaim",
        value
      };
    },

    eRC20DeployedClaim(value: MsgERC20DeployedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgERC20DeployedClaim",
        value
      };
    },

    logicCallExecutedClaim(value: MsgLogicCallExecutedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgLogicCallExecutedClaim",
        value
      };
    },

    setOrchestratorAddress(value: MsgSetOrchestratorAddress) {
      return {
        typeUrl: "/gravity.v1.MsgSetOrchestratorAddress",
        value
      };
    },

    cancelSendToEth(value: MsgCancelSendToEth) {
      return {
        typeUrl: "/gravity.v1.MsgCancelSendToEth",
        value
      };
    },

    submitBadSignatureEvidence(value: MsgSubmitBadSignatureEvidence) {
      return {
        typeUrl: "/gravity.v1.MsgSubmitBadSignatureEvidence",
        value
      };
    }

  },
  toJSON: {
    valsetConfirm(value: MsgValsetConfirm) {
      return {
        typeUrl: "/gravity.v1.MsgValsetConfirm",
        value: MsgValsetConfirm.toJSON(value)
      };
    },

    sendToEth(value: MsgSendToEth) {
      return {
        typeUrl: "/gravity.v1.MsgSendToEth",
        value: MsgSendToEth.toJSON(value)
      };
    },

    requestBatch(value: MsgRequestBatch) {
      return {
        typeUrl: "/gravity.v1.MsgRequestBatch",
        value: MsgRequestBatch.toJSON(value)
      };
    },

    confirmBatch(value: MsgConfirmBatch) {
      return {
        typeUrl: "/gravity.v1.MsgConfirmBatch",
        value: MsgConfirmBatch.toJSON(value)
      };
    },

    confirmLogicCall(value: MsgConfirmLogicCall) {
      return {
        typeUrl: "/gravity.v1.MsgConfirmLogicCall",
        value: MsgConfirmLogicCall.toJSON(value)
      };
    },

    sendToCosmosClaim(value: MsgSendToCosmosClaim) {
      return {
        typeUrl: "/gravity.v1.MsgSendToCosmosClaim",
        value: MsgSendToCosmosClaim.toJSON(value)
      };
    },

    executeIbcAutoForwards(value: MsgExecuteIbcAutoForwards) {
      return {
        typeUrl: "/gravity.v1.MsgExecuteIbcAutoForwards",
        value: MsgExecuteIbcAutoForwards.toJSON(value)
      };
    },

    batchSendToEthClaim(value: MsgBatchSendToEthClaim) {
      return {
        typeUrl: "/gravity.v1.MsgBatchSendToEthClaim",
        value: MsgBatchSendToEthClaim.toJSON(value)
      };
    },

    valsetUpdateClaim(value: MsgValsetUpdatedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgValsetUpdatedClaim",
        value: MsgValsetUpdatedClaim.toJSON(value)
      };
    },

    eRC20DeployedClaim(value: MsgERC20DeployedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgERC20DeployedClaim",
        value: MsgERC20DeployedClaim.toJSON(value)
      };
    },

    logicCallExecutedClaim(value: MsgLogicCallExecutedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgLogicCallExecutedClaim",
        value: MsgLogicCallExecutedClaim.toJSON(value)
      };
    },

    setOrchestratorAddress(value: MsgSetOrchestratorAddress) {
      return {
        typeUrl: "/gravity.v1.MsgSetOrchestratorAddress",
        value: MsgSetOrchestratorAddress.toJSON(value)
      };
    },

    cancelSendToEth(value: MsgCancelSendToEth) {
      return {
        typeUrl: "/gravity.v1.MsgCancelSendToEth",
        value: MsgCancelSendToEth.toJSON(value)
      };
    },

    submitBadSignatureEvidence(value: MsgSubmitBadSignatureEvidence) {
      return {
        typeUrl: "/gravity.v1.MsgSubmitBadSignatureEvidence",
        value: MsgSubmitBadSignatureEvidence.toJSON(value)
      };
    }

  },
  fromJSON: {
    valsetConfirm(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgValsetConfirm",
        value: MsgValsetConfirm.fromJSON(value)
      };
    },

    sendToEth(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgSendToEth",
        value: MsgSendToEth.fromJSON(value)
      };
    },

    requestBatch(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgRequestBatch",
        value: MsgRequestBatch.fromJSON(value)
      };
    },

    confirmBatch(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgConfirmBatch",
        value: MsgConfirmBatch.fromJSON(value)
      };
    },

    confirmLogicCall(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgConfirmLogicCall",
        value: MsgConfirmLogicCall.fromJSON(value)
      };
    },

    sendToCosmosClaim(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgSendToCosmosClaim",
        value: MsgSendToCosmosClaim.fromJSON(value)
      };
    },

    executeIbcAutoForwards(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgExecuteIbcAutoForwards",
        value: MsgExecuteIbcAutoForwards.fromJSON(value)
      };
    },

    batchSendToEthClaim(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgBatchSendToEthClaim",
        value: MsgBatchSendToEthClaim.fromJSON(value)
      };
    },

    valsetUpdateClaim(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgValsetUpdatedClaim",
        value: MsgValsetUpdatedClaim.fromJSON(value)
      };
    },

    eRC20DeployedClaim(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgERC20DeployedClaim",
        value: MsgERC20DeployedClaim.fromJSON(value)
      };
    },

    logicCallExecutedClaim(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgLogicCallExecutedClaim",
        value: MsgLogicCallExecutedClaim.fromJSON(value)
      };
    },

    setOrchestratorAddress(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgSetOrchestratorAddress",
        value: MsgSetOrchestratorAddress.fromJSON(value)
      };
    },

    cancelSendToEth(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgCancelSendToEth",
        value: MsgCancelSendToEth.fromJSON(value)
      };
    },

    submitBadSignatureEvidence(value: any) {
      return {
        typeUrl: "/gravity.v1.MsgSubmitBadSignatureEvidence",
        value: MsgSubmitBadSignatureEvidence.fromJSON(value)
      };
    }

  },
  fromPartial: {
    valsetConfirm(value: MsgValsetConfirm) {
      return {
        typeUrl: "/gravity.v1.MsgValsetConfirm",
        value: MsgValsetConfirm.fromPartial(value)
      };
    },

    sendToEth(value: MsgSendToEth) {
      return {
        typeUrl: "/gravity.v1.MsgSendToEth",
        value: MsgSendToEth.fromPartial(value)
      };
    },

    requestBatch(value: MsgRequestBatch) {
      return {
        typeUrl: "/gravity.v1.MsgRequestBatch",
        value: MsgRequestBatch.fromPartial(value)
      };
    },

    confirmBatch(value: MsgConfirmBatch) {
      return {
        typeUrl: "/gravity.v1.MsgConfirmBatch",
        value: MsgConfirmBatch.fromPartial(value)
      };
    },

    confirmLogicCall(value: MsgConfirmLogicCall) {
      return {
        typeUrl: "/gravity.v1.MsgConfirmLogicCall",
        value: MsgConfirmLogicCall.fromPartial(value)
      };
    },

    sendToCosmosClaim(value: MsgSendToCosmosClaim) {
      return {
        typeUrl: "/gravity.v1.MsgSendToCosmosClaim",
        value: MsgSendToCosmosClaim.fromPartial(value)
      };
    },

    executeIbcAutoForwards(value: MsgExecuteIbcAutoForwards) {
      return {
        typeUrl: "/gravity.v1.MsgExecuteIbcAutoForwards",
        value: MsgExecuteIbcAutoForwards.fromPartial(value)
      };
    },

    batchSendToEthClaim(value: MsgBatchSendToEthClaim) {
      return {
        typeUrl: "/gravity.v1.MsgBatchSendToEthClaim",
        value: MsgBatchSendToEthClaim.fromPartial(value)
      };
    },

    valsetUpdateClaim(value: MsgValsetUpdatedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgValsetUpdatedClaim",
        value: MsgValsetUpdatedClaim.fromPartial(value)
      };
    },

    eRC20DeployedClaim(value: MsgERC20DeployedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgERC20DeployedClaim",
        value: MsgERC20DeployedClaim.fromPartial(value)
      };
    },

    logicCallExecutedClaim(value: MsgLogicCallExecutedClaim) {
      return {
        typeUrl: "/gravity.v1.MsgLogicCallExecutedClaim",
        value: MsgLogicCallExecutedClaim.fromPartial(value)
      };
    },

    setOrchestratorAddress(value: MsgSetOrchestratorAddress) {
      return {
        typeUrl: "/gravity.v1.MsgSetOrchestratorAddress",
        value: MsgSetOrchestratorAddress.fromPartial(value)
      };
    },

    cancelSendToEth(value: MsgCancelSendToEth) {
      return {
        typeUrl: "/gravity.v1.MsgCancelSendToEth",
        value: MsgCancelSendToEth.fromPartial(value)
      };
    },

    submitBadSignatureEvidence(value: MsgSubmitBadSignatureEvidence) {
      return {
        typeUrl: "/gravity.v1.MsgSubmitBadSignatureEvidence",
        value: MsgSubmitBadSignatureEvidence.fromPartial(value)
      };
    }

  }
};