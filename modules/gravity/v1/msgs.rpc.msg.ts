import { Rpc } from "../../helpers";
import * as _m0 from "protobufjs/minimal";
import { MsgValsetConfirm, MsgValsetConfirmResponse, MsgSendToEth, MsgSendToEthResponse, MsgRequestBatch, MsgRequestBatchResponse, MsgConfirmBatch, MsgConfirmBatchResponse, MsgConfirmLogicCall, MsgConfirmLogicCallResponse, MsgSendToCosmosClaim, MsgSendToCosmosClaimResponse, MsgExecuteIbcAutoForwards, MsgExecuteIbcAutoForwardsResponse, MsgBatchSendToEthClaim, MsgBatchSendToEthClaimResponse, MsgValsetUpdatedClaim, MsgValsetUpdatedClaimResponse, MsgERC20DeployedClaim, MsgERC20DeployedClaimResponse, MsgLogicCallExecutedClaim, MsgLogicCallExecutedClaimResponse, MsgSetOrchestratorAddress, MsgSetOrchestratorAddressResponse, MsgCancelSendToEth, MsgCancelSendToEthResponse, MsgSubmitBadSignatureEvidence, MsgSubmitBadSignatureEvidenceResponse } from "./msgs";
/** Msg defines the state transitions possible within gravity */

export interface Msg {
  valsetConfirm(request: MsgValsetConfirm): Promise<MsgValsetConfirmResponse>;
  sendToEth(request: MsgSendToEth): Promise<MsgSendToEthResponse>;
  requestBatch(request: MsgRequestBatch): Promise<MsgRequestBatchResponse>;
  confirmBatch(request: MsgConfirmBatch): Promise<MsgConfirmBatchResponse>;
  confirmLogicCall(request: MsgConfirmLogicCall): Promise<MsgConfirmLogicCallResponse>;
  sendToCosmosClaim(request: MsgSendToCosmosClaim): Promise<MsgSendToCosmosClaimResponse>;
  executeIbcAutoForwards(request: MsgExecuteIbcAutoForwards): Promise<MsgExecuteIbcAutoForwardsResponse>;
  batchSendToEthClaim(request: MsgBatchSendToEthClaim): Promise<MsgBatchSendToEthClaimResponse>;
  valsetUpdateClaim(request: MsgValsetUpdatedClaim): Promise<MsgValsetUpdatedClaimResponse>;
  eRC20DeployedClaim(request: MsgERC20DeployedClaim): Promise<MsgERC20DeployedClaimResponse>;
  logicCallExecutedClaim(request: MsgLogicCallExecutedClaim): Promise<MsgLogicCallExecutedClaimResponse>;
  setOrchestratorAddress(request: MsgSetOrchestratorAddress): Promise<MsgSetOrchestratorAddressResponse>;
  cancelSendToEth(request: MsgCancelSendToEth): Promise<MsgCancelSendToEthResponse>;
  submitBadSignatureEvidence(request: MsgSubmitBadSignatureEvidence): Promise<MsgSubmitBadSignatureEvidenceResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.valsetConfirm = this.valsetConfirm.bind(this);
    this.sendToEth = this.sendToEth.bind(this);
    this.requestBatch = this.requestBatch.bind(this);
    this.confirmBatch = this.confirmBatch.bind(this);
    this.confirmLogicCall = this.confirmLogicCall.bind(this);
    this.sendToCosmosClaim = this.sendToCosmosClaim.bind(this);
    this.executeIbcAutoForwards = this.executeIbcAutoForwards.bind(this);
    this.batchSendToEthClaim = this.batchSendToEthClaim.bind(this);
    this.valsetUpdateClaim = this.valsetUpdateClaim.bind(this);
    this.eRC20DeployedClaim = this.eRC20DeployedClaim.bind(this);
    this.logicCallExecutedClaim = this.logicCallExecutedClaim.bind(this);
    this.setOrchestratorAddress = this.setOrchestratorAddress.bind(this);
    this.cancelSendToEth = this.cancelSendToEth.bind(this);
    this.submitBadSignatureEvidence = this.submitBadSignatureEvidence.bind(this);
  }

  valsetConfirm(request: MsgValsetConfirm): Promise<MsgValsetConfirmResponse> {
    const data = MsgValsetConfirm.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "ValsetConfirm", data);
    return promise.then(data => MsgValsetConfirmResponse.decode(new _m0.Reader(data)));
  }

  sendToEth(request: MsgSendToEth): Promise<MsgSendToEthResponse> {
    const data = MsgSendToEth.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "SendToEth", data);
    return promise.then(data => MsgSendToEthResponse.decode(new _m0.Reader(data)));
  }

  requestBatch(request: MsgRequestBatch): Promise<MsgRequestBatchResponse> {
    const data = MsgRequestBatch.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "RequestBatch", data);
    return promise.then(data => MsgRequestBatchResponse.decode(new _m0.Reader(data)));
  }

  confirmBatch(request: MsgConfirmBatch): Promise<MsgConfirmBatchResponse> {
    const data = MsgConfirmBatch.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "ConfirmBatch", data);
    return promise.then(data => MsgConfirmBatchResponse.decode(new _m0.Reader(data)));
  }

  confirmLogicCall(request: MsgConfirmLogicCall): Promise<MsgConfirmLogicCallResponse> {
    const data = MsgConfirmLogicCall.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "ConfirmLogicCall", data);
    return promise.then(data => MsgConfirmLogicCallResponse.decode(new _m0.Reader(data)));
  }

  sendToCosmosClaim(request: MsgSendToCosmosClaim): Promise<MsgSendToCosmosClaimResponse> {
    const data = MsgSendToCosmosClaim.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "SendToCosmosClaim", data);
    return promise.then(data => MsgSendToCosmosClaimResponse.decode(new _m0.Reader(data)));
  }

  executeIbcAutoForwards(request: MsgExecuteIbcAutoForwards): Promise<MsgExecuteIbcAutoForwardsResponse> {
    const data = MsgExecuteIbcAutoForwards.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "ExecuteIbcAutoForwards", data);
    return promise.then(data => MsgExecuteIbcAutoForwardsResponse.decode(new _m0.Reader(data)));
  }

  batchSendToEthClaim(request: MsgBatchSendToEthClaim): Promise<MsgBatchSendToEthClaimResponse> {
    const data = MsgBatchSendToEthClaim.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "BatchSendToEthClaim", data);
    return promise.then(data => MsgBatchSendToEthClaimResponse.decode(new _m0.Reader(data)));
  }

  valsetUpdateClaim(request: MsgValsetUpdatedClaim): Promise<MsgValsetUpdatedClaimResponse> {
    const data = MsgValsetUpdatedClaim.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "ValsetUpdateClaim", data);
    return promise.then(data => MsgValsetUpdatedClaimResponse.decode(new _m0.Reader(data)));
  }

  eRC20DeployedClaim(request: MsgERC20DeployedClaim): Promise<MsgERC20DeployedClaimResponse> {
    const data = MsgERC20DeployedClaim.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "ERC20DeployedClaim", data);
    return promise.then(data => MsgERC20DeployedClaimResponse.decode(new _m0.Reader(data)));
  }

  logicCallExecutedClaim(request: MsgLogicCallExecutedClaim): Promise<MsgLogicCallExecutedClaimResponse> {
    const data = MsgLogicCallExecutedClaim.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "LogicCallExecutedClaim", data);
    return promise.then(data => MsgLogicCallExecutedClaimResponse.decode(new _m0.Reader(data)));
  }

  setOrchestratorAddress(request: MsgSetOrchestratorAddress): Promise<MsgSetOrchestratorAddressResponse> {
    const data = MsgSetOrchestratorAddress.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "SetOrchestratorAddress", data);
    return promise.then(data => MsgSetOrchestratorAddressResponse.decode(new _m0.Reader(data)));
  }

  cancelSendToEth(request: MsgCancelSendToEth): Promise<MsgCancelSendToEthResponse> {
    const data = MsgCancelSendToEth.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "CancelSendToEth", data);
    return promise.then(data => MsgCancelSendToEthResponse.decode(new _m0.Reader(data)));
  }

  submitBadSignatureEvidence(request: MsgSubmitBadSignatureEvidence): Promise<MsgSubmitBadSignatureEvidenceResponse> {
    const data = MsgSubmitBadSignatureEvidence.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "SubmitBadSignatureEvidence", data);
    return promise.then(data => MsgSubmitBadSignatureEvidenceResponse.decode(new _m0.Reader(data)));
  }

}