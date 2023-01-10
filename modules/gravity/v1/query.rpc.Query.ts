import { Rpc } from "../../helpers";
import * as _m0 from "protobufjs/minimal";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { QueryParamsRequest, QueryParamsResponse, QueryCurrentValsetRequest, QueryCurrentValsetResponse, QueryValsetRequestRequest, QueryValsetRequestResponse, QueryValsetConfirmRequest, QueryValsetConfirmResponse, QueryValsetConfirmsByNonceRequest, QueryValsetConfirmsByNonceResponse, QueryLastValsetRequestsRequest, QueryLastValsetRequestsResponse, QueryLastPendingValsetRequestByAddrRequest, QueryLastPendingValsetRequestByAddrResponse, QueryLastPendingBatchRequestByAddrRequest, QueryLastPendingBatchRequestByAddrResponse, QueryLastPendingLogicCallByAddrRequest, QueryLastPendingLogicCallByAddrResponse, QueryLastEventNonceByAddrRequest, QueryLastEventNonceByAddrResponse, QueryBatchFeeRequest, QueryBatchFeeResponse, QueryOutgoingTxBatchesRequest, QueryOutgoingTxBatchesResponse, QueryOutgoingLogicCallsRequest, QueryOutgoingLogicCallsResponse, QueryBatchRequestByNonceRequest, QueryBatchRequestByNonceResponse, QueryBatchConfirmsRequest, QueryBatchConfirmsResponse, QueryLogicConfirmsRequest, QueryLogicConfirmsResponse, QueryERC20ToDenomRequest, QueryERC20ToDenomResponse, QueryDenomToERC20Request, QueryDenomToERC20Response, QueryLastObservedEthBlockRequest, QueryLastObservedEthBlockResponse, QueryLastObservedEthNonceRequest, QueryLastObservedEthNonceResponse, QueryAttestationsRequest, QueryAttestationsResponse, QueryDelegateKeysByValidatorAddress, QueryDelegateKeysByValidatorAddressResponse, QueryDelegateKeysByEthAddress, QueryDelegateKeysByEthAddressResponse, QueryDelegateKeysByOrchestratorAddress, QueryDelegateKeysByOrchestratorAddressResponse, QueryPendingSendToEth, QueryPendingSendToEthResponse, QueryPendingIbcAutoForwards, QueryPendingIbcAutoForwardsResponse } from "./query";
/** Query defines the gRPC querier service */

export interface Query {
  /** Deployments queries deployments */
  params(request?: QueryParamsRequest): Promise<QueryParamsResponse>;
  currentValset(request?: QueryCurrentValsetRequest): Promise<QueryCurrentValsetResponse>;
  valsetRequest(request: QueryValsetRequestRequest): Promise<QueryValsetRequestResponse>;
  valsetConfirm(request: QueryValsetConfirmRequest): Promise<QueryValsetConfirmResponse>;
  valsetConfirmsByNonce(request: QueryValsetConfirmsByNonceRequest): Promise<QueryValsetConfirmsByNonceResponse>;
  lastValsetRequests(request?: QueryLastValsetRequestsRequest): Promise<QueryLastValsetRequestsResponse>;
  lastPendingValsetRequestByAddr(request: QueryLastPendingValsetRequestByAddrRequest): Promise<QueryLastPendingValsetRequestByAddrResponse>;
  lastPendingBatchRequestByAddr(request: QueryLastPendingBatchRequestByAddrRequest): Promise<QueryLastPendingBatchRequestByAddrResponse>;
  lastPendingLogicCallByAddr(request: QueryLastPendingLogicCallByAddrRequest): Promise<QueryLastPendingLogicCallByAddrResponse>;
  lastEventNonceByAddr(request: QueryLastEventNonceByAddrRequest): Promise<QueryLastEventNonceByAddrResponse>;
  batchFees(request?: QueryBatchFeeRequest): Promise<QueryBatchFeeResponse>;
  outgoingTxBatches(request?: QueryOutgoingTxBatchesRequest): Promise<QueryOutgoingTxBatchesResponse>;
  outgoingLogicCalls(request?: QueryOutgoingLogicCallsRequest): Promise<QueryOutgoingLogicCallsResponse>;
  batchRequestByNonce(request: QueryBatchRequestByNonceRequest): Promise<QueryBatchRequestByNonceResponse>;
  batchConfirms(request: QueryBatchConfirmsRequest): Promise<QueryBatchConfirmsResponse>;
  logicConfirms(request: QueryLogicConfirmsRequest): Promise<QueryLogicConfirmsResponse>;
  eRC20ToDenom(request: QueryERC20ToDenomRequest): Promise<QueryERC20ToDenomResponse>;
  denomToERC20(request: QueryDenomToERC20Request): Promise<QueryDenomToERC20Response>;
  getLastObservedEthBlock(request: QueryLastObservedEthBlockRequest): Promise<QueryLastObservedEthBlockResponse>;
  getLastObservedEthNonce(request: QueryLastObservedEthNonceRequest): Promise<QueryLastObservedEthNonceResponse>;
  getAttestations(request: QueryAttestationsRequest): Promise<QueryAttestationsResponse>;
  getDelegateKeyByValidator(request: QueryDelegateKeysByValidatorAddress): Promise<QueryDelegateKeysByValidatorAddressResponse>;
  getDelegateKeyByEth(request: QueryDelegateKeysByEthAddress): Promise<QueryDelegateKeysByEthAddressResponse>;
  getDelegateKeyByOrchestrator(request: QueryDelegateKeysByOrchestratorAddress): Promise<QueryDelegateKeysByOrchestratorAddressResponse>;
  getPendingSendToEth(request: QueryPendingSendToEth): Promise<QueryPendingSendToEthResponse>;
  getPendingIbcAutoForwards(request: QueryPendingIbcAutoForwards): Promise<QueryPendingIbcAutoForwardsResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.params = this.params.bind(this);
    this.currentValset = this.currentValset.bind(this);
    this.valsetRequest = this.valsetRequest.bind(this);
    this.valsetConfirm = this.valsetConfirm.bind(this);
    this.valsetConfirmsByNonce = this.valsetConfirmsByNonce.bind(this);
    this.lastValsetRequests = this.lastValsetRequests.bind(this);
    this.lastPendingValsetRequestByAddr = this.lastPendingValsetRequestByAddr.bind(this);
    this.lastPendingBatchRequestByAddr = this.lastPendingBatchRequestByAddr.bind(this);
    this.lastPendingLogicCallByAddr = this.lastPendingLogicCallByAddr.bind(this);
    this.lastEventNonceByAddr = this.lastEventNonceByAddr.bind(this);
    this.batchFees = this.batchFees.bind(this);
    this.outgoingTxBatches = this.outgoingTxBatches.bind(this);
    this.outgoingLogicCalls = this.outgoingLogicCalls.bind(this);
    this.batchRequestByNonce = this.batchRequestByNonce.bind(this);
    this.batchConfirms = this.batchConfirms.bind(this);
    this.logicConfirms = this.logicConfirms.bind(this);
    this.eRC20ToDenom = this.eRC20ToDenom.bind(this);
    this.denomToERC20 = this.denomToERC20.bind(this);
    this.getLastObservedEthBlock = this.getLastObservedEthBlock.bind(this);
    this.getLastObservedEthNonce = this.getLastObservedEthNonce.bind(this);
    this.getAttestations = this.getAttestations.bind(this);
    this.getDelegateKeyByValidator = this.getDelegateKeyByValidator.bind(this);
    this.getDelegateKeyByEth = this.getDelegateKeyByEth.bind(this);
    this.getDelegateKeyByOrchestrator = this.getDelegateKeyByOrchestrator.bind(this);
    this.getPendingSendToEth = this.getPendingSendToEth.bind(this);
    this.getPendingIbcAutoForwards = this.getPendingIbcAutoForwards.bind(this);
  }

  params(request: QueryParamsRequest = {}): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "Params", data);
    return promise.then(data => QueryParamsResponse.decode(new _m0.Reader(data)));
  }

  currentValset(request: QueryCurrentValsetRequest = {}): Promise<QueryCurrentValsetResponse> {
    const data = QueryCurrentValsetRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "CurrentValset", data);
    return promise.then(data => QueryCurrentValsetResponse.decode(new _m0.Reader(data)));
  }

  valsetRequest(request: QueryValsetRequestRequest): Promise<QueryValsetRequestResponse> {
    const data = QueryValsetRequestRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "ValsetRequest", data);
    return promise.then(data => QueryValsetRequestResponse.decode(new _m0.Reader(data)));
  }

  valsetConfirm(request: QueryValsetConfirmRequest): Promise<QueryValsetConfirmResponse> {
    const data = QueryValsetConfirmRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "ValsetConfirm", data);
    return promise.then(data => QueryValsetConfirmResponse.decode(new _m0.Reader(data)));
  }

  valsetConfirmsByNonce(request: QueryValsetConfirmsByNonceRequest): Promise<QueryValsetConfirmsByNonceResponse> {
    const data = QueryValsetConfirmsByNonceRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "ValsetConfirmsByNonce", data);
    return promise.then(data => QueryValsetConfirmsByNonceResponse.decode(new _m0.Reader(data)));
  }

  lastValsetRequests(request: QueryLastValsetRequestsRequest = {}): Promise<QueryLastValsetRequestsResponse> {
    const data = QueryLastValsetRequestsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "LastValsetRequests", data);
    return promise.then(data => QueryLastValsetRequestsResponse.decode(new _m0.Reader(data)));
  }

  lastPendingValsetRequestByAddr(request: QueryLastPendingValsetRequestByAddrRequest): Promise<QueryLastPendingValsetRequestByAddrResponse> {
    const data = QueryLastPendingValsetRequestByAddrRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "LastPendingValsetRequestByAddr", data);
    return promise.then(data => QueryLastPendingValsetRequestByAddrResponse.decode(new _m0.Reader(data)));
  }

  lastPendingBatchRequestByAddr(request: QueryLastPendingBatchRequestByAddrRequest): Promise<QueryLastPendingBatchRequestByAddrResponse> {
    const data = QueryLastPendingBatchRequestByAddrRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "LastPendingBatchRequestByAddr", data);
    return promise.then(data => QueryLastPendingBatchRequestByAddrResponse.decode(new _m0.Reader(data)));
  }

  lastPendingLogicCallByAddr(request: QueryLastPendingLogicCallByAddrRequest): Promise<QueryLastPendingLogicCallByAddrResponse> {
    const data = QueryLastPendingLogicCallByAddrRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "LastPendingLogicCallByAddr", data);
    return promise.then(data => QueryLastPendingLogicCallByAddrResponse.decode(new _m0.Reader(data)));
  }

  lastEventNonceByAddr(request: QueryLastEventNonceByAddrRequest): Promise<QueryLastEventNonceByAddrResponse> {
    const data = QueryLastEventNonceByAddrRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "LastEventNonceByAddr", data);
    return promise.then(data => QueryLastEventNonceByAddrResponse.decode(new _m0.Reader(data)));
  }

  batchFees(request: QueryBatchFeeRequest = {}): Promise<QueryBatchFeeResponse> {
    const data = QueryBatchFeeRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "BatchFees", data);
    return promise.then(data => QueryBatchFeeResponse.decode(new _m0.Reader(data)));
  }

  outgoingTxBatches(request: QueryOutgoingTxBatchesRequest = {}): Promise<QueryOutgoingTxBatchesResponse> {
    const data = QueryOutgoingTxBatchesRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "OutgoingTxBatches", data);
    return promise.then(data => QueryOutgoingTxBatchesResponse.decode(new _m0.Reader(data)));
  }

  outgoingLogicCalls(request: QueryOutgoingLogicCallsRequest = {}): Promise<QueryOutgoingLogicCallsResponse> {
    const data = QueryOutgoingLogicCallsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "OutgoingLogicCalls", data);
    return promise.then(data => QueryOutgoingLogicCallsResponse.decode(new _m0.Reader(data)));
  }

  batchRequestByNonce(request: QueryBatchRequestByNonceRequest): Promise<QueryBatchRequestByNonceResponse> {
    const data = QueryBatchRequestByNonceRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "BatchRequestByNonce", data);
    return promise.then(data => QueryBatchRequestByNonceResponse.decode(new _m0.Reader(data)));
  }

  batchConfirms(request: QueryBatchConfirmsRequest): Promise<QueryBatchConfirmsResponse> {
    const data = QueryBatchConfirmsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "BatchConfirms", data);
    return promise.then(data => QueryBatchConfirmsResponse.decode(new _m0.Reader(data)));
  }

  logicConfirms(request: QueryLogicConfirmsRequest): Promise<QueryLogicConfirmsResponse> {
    const data = QueryLogicConfirmsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "LogicConfirms", data);
    return promise.then(data => QueryLogicConfirmsResponse.decode(new _m0.Reader(data)));
  }

  eRC20ToDenom(request: QueryERC20ToDenomRequest): Promise<QueryERC20ToDenomResponse> {
    const data = QueryERC20ToDenomRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "ERC20ToDenom", data);
    return promise.then(data => QueryERC20ToDenomResponse.decode(new _m0.Reader(data)));
  }

  denomToERC20(request: QueryDenomToERC20Request): Promise<QueryDenomToERC20Response> {
    const data = QueryDenomToERC20Request.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "DenomToERC20", data);
    return promise.then(data => QueryDenomToERC20Response.decode(new _m0.Reader(data)));
  }

  getLastObservedEthBlock(request: QueryLastObservedEthBlockRequest): Promise<QueryLastObservedEthBlockResponse> {
    const data = QueryLastObservedEthBlockRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "GetLastObservedEthBlock", data);
    return promise.then(data => QueryLastObservedEthBlockResponse.decode(new _m0.Reader(data)));
  }

  getLastObservedEthNonce(request: QueryLastObservedEthNonceRequest): Promise<QueryLastObservedEthNonceResponse> {
    const data = QueryLastObservedEthNonceRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "GetLastObservedEthNonce", data);
    return promise.then(data => QueryLastObservedEthNonceResponse.decode(new _m0.Reader(data)));
  }

  getAttestations(request: QueryAttestationsRequest): Promise<QueryAttestationsResponse> {
    const data = QueryAttestationsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "GetAttestations", data);
    return promise.then(data => QueryAttestationsResponse.decode(new _m0.Reader(data)));
  }

  getDelegateKeyByValidator(request: QueryDelegateKeysByValidatorAddress): Promise<QueryDelegateKeysByValidatorAddressResponse> {
    const data = QueryDelegateKeysByValidatorAddress.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "GetDelegateKeyByValidator", data);
    return promise.then(data => QueryDelegateKeysByValidatorAddressResponse.decode(new _m0.Reader(data)));
  }

  getDelegateKeyByEth(request: QueryDelegateKeysByEthAddress): Promise<QueryDelegateKeysByEthAddressResponse> {
    const data = QueryDelegateKeysByEthAddress.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "GetDelegateKeyByEth", data);
    return promise.then(data => QueryDelegateKeysByEthAddressResponse.decode(new _m0.Reader(data)));
  }

  getDelegateKeyByOrchestrator(request: QueryDelegateKeysByOrchestratorAddress): Promise<QueryDelegateKeysByOrchestratorAddressResponse> {
    const data = QueryDelegateKeysByOrchestratorAddress.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "GetDelegateKeyByOrchestrator", data);
    return promise.then(data => QueryDelegateKeysByOrchestratorAddressResponse.decode(new _m0.Reader(data)));
  }

  getPendingSendToEth(request: QueryPendingSendToEth): Promise<QueryPendingSendToEthResponse> {
    const data = QueryPendingSendToEth.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "GetPendingSendToEth", data);
    return promise.then(data => QueryPendingSendToEthResponse.decode(new _m0.Reader(data)));
  }

  getPendingIbcAutoForwards(request: QueryPendingIbcAutoForwards): Promise<QueryPendingIbcAutoForwardsResponse> {
    const data = QueryPendingIbcAutoForwards.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "GetPendingIbcAutoForwards", data);
    return promise.then(data => QueryPendingIbcAutoForwardsResponse.decode(new _m0.Reader(data)));
  }

}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    params(request?: QueryParamsRequest): Promise<QueryParamsResponse> {
      return queryService.params(request);
    },

    currentValset(request?: QueryCurrentValsetRequest): Promise<QueryCurrentValsetResponse> {
      return queryService.currentValset(request);
    },

    valsetRequest(request: QueryValsetRequestRequest): Promise<QueryValsetRequestResponse> {
      return queryService.valsetRequest(request);
    },

    valsetConfirm(request: QueryValsetConfirmRequest): Promise<QueryValsetConfirmResponse> {
      return queryService.valsetConfirm(request);
    },

    valsetConfirmsByNonce(request: QueryValsetConfirmsByNonceRequest): Promise<QueryValsetConfirmsByNonceResponse> {
      return queryService.valsetConfirmsByNonce(request);
    },

    lastValsetRequests(request?: QueryLastValsetRequestsRequest): Promise<QueryLastValsetRequestsResponse> {
      return queryService.lastValsetRequests(request);
    },

    lastPendingValsetRequestByAddr(request: QueryLastPendingValsetRequestByAddrRequest): Promise<QueryLastPendingValsetRequestByAddrResponse> {
      return queryService.lastPendingValsetRequestByAddr(request);
    },

    lastPendingBatchRequestByAddr(request: QueryLastPendingBatchRequestByAddrRequest): Promise<QueryLastPendingBatchRequestByAddrResponse> {
      return queryService.lastPendingBatchRequestByAddr(request);
    },

    lastPendingLogicCallByAddr(request: QueryLastPendingLogicCallByAddrRequest): Promise<QueryLastPendingLogicCallByAddrResponse> {
      return queryService.lastPendingLogicCallByAddr(request);
    },

    lastEventNonceByAddr(request: QueryLastEventNonceByAddrRequest): Promise<QueryLastEventNonceByAddrResponse> {
      return queryService.lastEventNonceByAddr(request);
    },

    batchFees(request?: QueryBatchFeeRequest): Promise<QueryBatchFeeResponse> {
      return queryService.batchFees(request);
    },

    outgoingTxBatches(request?: QueryOutgoingTxBatchesRequest): Promise<QueryOutgoingTxBatchesResponse> {
      return queryService.outgoingTxBatches(request);
    },

    outgoingLogicCalls(request?: QueryOutgoingLogicCallsRequest): Promise<QueryOutgoingLogicCallsResponse> {
      return queryService.outgoingLogicCalls(request);
    },

    batchRequestByNonce(request: QueryBatchRequestByNonceRequest): Promise<QueryBatchRequestByNonceResponse> {
      return queryService.batchRequestByNonce(request);
    },

    batchConfirms(request: QueryBatchConfirmsRequest): Promise<QueryBatchConfirmsResponse> {
      return queryService.batchConfirms(request);
    },

    logicConfirms(request: QueryLogicConfirmsRequest): Promise<QueryLogicConfirmsResponse> {
      return queryService.logicConfirms(request);
    },

    eRC20ToDenom(request: QueryERC20ToDenomRequest): Promise<QueryERC20ToDenomResponse> {
      return queryService.eRC20ToDenom(request);
    },

    denomToERC20(request: QueryDenomToERC20Request): Promise<QueryDenomToERC20Response> {
      return queryService.denomToERC20(request);
    },

    getLastObservedEthBlock(request: QueryLastObservedEthBlockRequest): Promise<QueryLastObservedEthBlockResponse> {
      return queryService.getLastObservedEthBlock(request);
    },

    getLastObservedEthNonce(request: QueryLastObservedEthNonceRequest): Promise<QueryLastObservedEthNonceResponse> {
      return queryService.getLastObservedEthNonce(request);
    },

    getAttestations(request: QueryAttestationsRequest): Promise<QueryAttestationsResponse> {
      return queryService.getAttestations(request);
    },

    getDelegateKeyByValidator(request: QueryDelegateKeysByValidatorAddress): Promise<QueryDelegateKeysByValidatorAddressResponse> {
      return queryService.getDelegateKeyByValidator(request);
    },

    getDelegateKeyByEth(request: QueryDelegateKeysByEthAddress): Promise<QueryDelegateKeysByEthAddressResponse> {
      return queryService.getDelegateKeyByEth(request);
    },

    getDelegateKeyByOrchestrator(request: QueryDelegateKeysByOrchestratorAddress): Promise<QueryDelegateKeysByOrchestratorAddressResponse> {
      return queryService.getDelegateKeyByOrchestrator(request);
    },

    getPendingSendToEth(request: QueryPendingSendToEth): Promise<QueryPendingSendToEthResponse> {
      return queryService.getPendingSendToEth(request);
    },

    getPendingIbcAutoForwards(request: QueryPendingIbcAutoForwards): Promise<QueryPendingIbcAutoForwardsResponse> {
      return queryService.getPendingIbcAutoForwards(request);
    }

  };
};