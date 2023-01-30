import { LCDClient } from "@osmonauts/lcd";
import { QueryParamsRequest, QueryParamsResponseSDKType, QueryCurrentValsetRequest, QueryCurrentValsetResponseSDKType, QueryValsetRequestRequest, QueryValsetRequestResponseSDKType, QueryValsetConfirmRequest, QueryValsetConfirmResponseSDKType, QueryValsetConfirmsByNonceRequest, QueryValsetConfirmsByNonceResponseSDKType, QueryLastValsetRequestsRequest, QueryLastValsetRequestsResponseSDKType, QueryLastPendingValsetRequestByAddrRequest, QueryLastPendingValsetRequestByAddrResponseSDKType, QueryLastPendingBatchRequestByAddrRequest, QueryLastPendingBatchRequestByAddrResponseSDKType, QueryLastPendingLogicCallByAddrRequest, QueryLastPendingLogicCallByAddrResponseSDKType, QueryLastEventNonceByAddrRequest, QueryLastEventNonceByAddrResponseSDKType, QueryBatchFeeRequest, QueryBatchFeeResponseSDKType, QueryOutgoingTxBatchesRequest, QueryOutgoingTxBatchesResponseSDKType, QueryOutgoingLogicCallsRequest, QueryOutgoingLogicCallsResponseSDKType, QueryBatchRequestByNonceRequest, QueryBatchRequestByNonceResponseSDKType, QueryBatchConfirmsRequest, QueryBatchConfirmsResponseSDKType, QueryLogicConfirmsRequest, QueryLogicConfirmsResponseSDKType, QueryERC20ToDenomRequest, QueryERC20ToDenomResponseSDKType, QueryDenomToERC20Request, QueryDenomToERC20ResponseSDKType, QueryLastObservedEthBlockRequest, QueryLastObservedEthBlockResponseSDKType, QueryLastObservedEthNonceRequest, QueryLastObservedEthNonceResponseSDKType, QueryAttestationsRequest, QueryAttestationsResponseSDKType, QueryDelegateKeysByValidatorAddress, QueryDelegateKeysByValidatorAddressResponseSDKType, QueryDelegateKeysByEthAddress, QueryDelegateKeysByEthAddressResponseSDKType, QueryDelegateKeysByOrchestratorAddress, QueryDelegateKeysByOrchestratorAddressResponseSDKType, QueryPendingSendToEth, QueryPendingSendToEthResponseSDKType, QueryPendingIbcAutoForwards, QueryPendingIbcAutoForwardsResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;

  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
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
  /* Deployments queries deployments */


  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `gravity/v1beta/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
  /* CurrentValset */


  async currentValset(_params: QueryCurrentValsetRequest = {}): Promise<QueryCurrentValsetResponseSDKType> {
    const endpoint = `gravity/v1beta/valset/current`;
    return await this.req.get<QueryCurrentValsetResponseSDKType>(endpoint);
  }
  /* ValsetRequest */


  async valsetRequest(params: QueryValsetRequestRequest): Promise<QueryValsetRequestResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.nonce !== "undefined") {
      options.params.nonce = params.nonce;
    }

    const endpoint = `gravity/v1beta/valset`;
    return await this.req.get<QueryValsetRequestResponseSDKType>(endpoint, options);
  }
  /* ValsetConfirm */


  async valsetConfirm(params: QueryValsetConfirmRequest): Promise<QueryValsetConfirmResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.nonce !== "undefined") {
      options.params.nonce = params.nonce;
    }

    if (typeof params?.address !== "undefined") {
      options.params.address = params.address;
    }

    const endpoint = `gravity/v1beta/valset/confirm`;
    return await this.req.get<QueryValsetConfirmResponseSDKType>(endpoint, options);
  }
  /* ValsetConfirmsByNonce */


  async valsetConfirmsByNonce(params: QueryValsetConfirmsByNonceRequest): Promise<QueryValsetConfirmsByNonceResponseSDKType> {
    const endpoint = `gravity/v1beta/confirms/${params.nonce}`;
    return await this.req.get<QueryValsetConfirmsByNonceResponseSDKType>(endpoint);
  }
  /* LastValsetRequests */


  async lastValsetRequests(_params: QueryLastValsetRequestsRequest = {}): Promise<QueryLastValsetRequestsResponseSDKType> {
    const endpoint = `gravity/v1beta/valset/requests`;
    return await this.req.get<QueryLastValsetRequestsResponseSDKType>(endpoint);
  }
  /* LastPendingValsetRequestByAddr */


  async lastPendingValsetRequestByAddr(params: QueryLastPendingValsetRequestByAddrRequest): Promise<QueryLastPendingValsetRequestByAddrResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.address !== "undefined") {
      options.params.address = params.address;
    }

    const endpoint = `gravity/v1beta/valset/last`;
    return await this.req.get<QueryLastPendingValsetRequestByAddrResponseSDKType>(endpoint, options);
  }
  /* LastPendingBatchRequestByAddr */


  async lastPendingBatchRequestByAddr(params: QueryLastPendingBatchRequestByAddrRequest): Promise<QueryLastPendingBatchRequestByAddrResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.address !== "undefined") {
      options.params.address = params.address;
    }

    const endpoint = `gravity/v1beta/batch/last_pending_request_by_addr`;
    return await this.req.get<QueryLastPendingBatchRequestByAddrResponseSDKType>(endpoint, options);
  }
  /* LastPendingLogicCallByAddr */


  async lastPendingLogicCallByAddr(params: QueryLastPendingLogicCallByAddrRequest): Promise<QueryLastPendingLogicCallByAddrResponseSDKType> {
    const endpoint = `gravity/v1beta/logic/${params.address}`;
    return await this.req.get<QueryLastPendingLogicCallByAddrResponseSDKType>(endpoint);
  }
  /* LastEventNonceByAddr */


  async lastEventNonceByAddr(params: QueryLastEventNonceByAddrRequest): Promise<QueryLastEventNonceByAddrResponseSDKType> {
    const endpoint = `gravity/v1beta/oracle/eventnonce/${params.address}`;
    return await this.req.get<QueryLastEventNonceByAddrResponseSDKType>(endpoint);
  }
  /* BatchFees */


  async batchFees(_params: QueryBatchFeeRequest = {}): Promise<QueryBatchFeeResponseSDKType> {
    const endpoint = `gravity/v1beta/batchfees`;
    return await this.req.get<QueryBatchFeeResponseSDKType>(endpoint);
  }
  /* OutgoingTxBatches */


  async outgoingTxBatches(_params: QueryOutgoingTxBatchesRequest = {}): Promise<QueryOutgoingTxBatchesResponseSDKType> {
    const endpoint = `gravity/v1beta/batch/outgoingtx`;
    return await this.req.get<QueryOutgoingTxBatchesResponseSDKType>(endpoint);
  }
  /* OutgoingLogicCalls */


  async outgoingLogicCalls(_params: QueryOutgoingLogicCallsRequest = {}): Promise<QueryOutgoingLogicCallsResponseSDKType> {
    const endpoint = `gravity/v1beta/batch/outgoinglogic`;
    return await this.req.get<QueryOutgoingLogicCallsResponseSDKType>(endpoint);
  }
  /* BatchRequestByNonce */


  async batchRequestByNonce(params: QueryBatchRequestByNonceRequest): Promise<QueryBatchRequestByNonceResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.nonce !== "undefined") {
      options.params.nonce = params.nonce;
    }

    if (typeof params?.contractAddress !== "undefined") {
      options.params.contract_address = params.contractAddress;
    }

    const endpoint = `gravity/v1beta/batch/request_by_nonce`;
    return await this.req.get<QueryBatchRequestByNonceResponseSDKType>(endpoint, options);
  }
  /* BatchConfirms */


  async batchConfirms(params: QueryBatchConfirmsRequest): Promise<QueryBatchConfirmsResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.nonce !== "undefined") {
      options.params.nonce = params.nonce;
    }

    if (typeof params?.contractAddress !== "undefined") {
      options.params.contract_address = params.contractAddress;
    }

    const endpoint = `gravity/v1beta/batch/confirms`;
    return await this.req.get<QueryBatchConfirmsResponseSDKType>(endpoint, options);
  }
  /* LogicConfirms */


  async logicConfirms(params: QueryLogicConfirmsRequest): Promise<QueryLogicConfirmsResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.invalidationId !== "undefined") {
      options.params.invalidation_id = params.invalidationId;
    }

    if (typeof params?.invalidationNonce !== "undefined") {
      options.params.invalidation_nonce = params.invalidationNonce;
    }

    const endpoint = `gravity/v1beta/logic/confirms`;
    return await this.req.get<QueryLogicConfirmsResponseSDKType>(endpoint, options);
  }
  /* ERC20ToDenom */


  async eRC20ToDenom(params: QueryERC20ToDenomRequest): Promise<QueryERC20ToDenomResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.erc20 !== "undefined") {
      options.params.erc20 = params.erc20;
    }

    const endpoint = `gravity/v1beta/cosmos_originated/erc20_to_denom`;
    return await this.req.get<QueryERC20ToDenomResponseSDKType>(endpoint, options);
  }
  /* DenomToERC20 */


  async denomToERC20(params: QueryDenomToERC20Request): Promise<QueryDenomToERC20ResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.denom !== "undefined") {
      options.params.denom = params.denom;
    }

    const endpoint = `gravity/v1beta/cosmos_originated/denom_to_erc20`;
    return await this.req.get<QueryDenomToERC20ResponseSDKType>(endpoint, options);
  }
  /* GetLastObservedEthBlock */


  async getLastObservedEthBlock(params: QueryLastObservedEthBlockRequest): Promise<QueryLastObservedEthBlockResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.useV1Key !== "undefined") {
      options.params.use_v1_key = params.useV1Key;
    }

    const endpoint = `gravity/v1beta/query_last_observed_eth_block`;
    return await this.req.get<QueryLastObservedEthBlockResponseSDKType>(endpoint, options);
  }
  /* GetLastObservedEthNonce */


  async getLastObservedEthNonce(params: QueryLastObservedEthNonceRequest): Promise<QueryLastObservedEthNonceResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.useV1Key !== "undefined") {
      options.params.use_v1_key = params.useV1Key;
    }

    const endpoint = `gravity/v1beta/query_last_observed_eth_nonce`;
    return await this.req.get<QueryLastObservedEthNonceResponseSDKType>(endpoint, options);
  }
  /* GetAttestations */


  async getAttestations(params: QueryAttestationsRequest): Promise<QueryAttestationsResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.limit !== "undefined") {
      options.params.limit = params.limit;
    }

    if (typeof params?.orderBy !== "undefined") {
      options.params.order_by = params.orderBy;
    }

    if (typeof params?.claimType !== "undefined") {
      options.params.claim_type = params.claimType;
    }

    if (typeof params?.nonce !== "undefined") {
      options.params.nonce = params.nonce;
    }

    if (typeof params?.height !== "undefined") {
      options.params.height = params.height;
    }

    if (typeof params?.useV1Key !== "undefined") {
      options.params.use_v1_key = params.useV1Key;
    }

    const endpoint = `gravity/v1beta/query_attestations`;
    return await this.req.get<QueryAttestationsResponseSDKType>(endpoint, options);
  }
  /* GetDelegateKeyByValidator */


  async getDelegateKeyByValidator(params: QueryDelegateKeysByValidatorAddress): Promise<QueryDelegateKeysByValidatorAddressResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.validatorAddress !== "undefined") {
      options.params.validator_address = params.validatorAddress;
    }

    const endpoint = `gravity/v1beta/query_delegate_keys_by_validator`;
    return await this.req.get<QueryDelegateKeysByValidatorAddressResponseSDKType>(endpoint, options);
  }
  /* GetDelegateKeyByEth */


  async getDelegateKeyByEth(params: QueryDelegateKeysByEthAddress): Promise<QueryDelegateKeysByEthAddressResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.ethAddress !== "undefined") {
      options.params.eth_address = params.ethAddress;
    }

    const endpoint = `gravity/v1beta/query_delegate_keys_by_eth`;
    return await this.req.get<QueryDelegateKeysByEthAddressResponseSDKType>(endpoint, options);
  }
  /* GetDelegateKeyByOrchestrator */


  async getDelegateKeyByOrchestrator(params: QueryDelegateKeysByOrchestratorAddress): Promise<QueryDelegateKeysByOrchestratorAddressResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.orchestratorAddress !== "undefined") {
      options.params.orchestrator_address = params.orchestratorAddress;
    }

    const endpoint = `gravity/v1beta/query_delegate_keys_by_orchestrator`;
    return await this.req.get<QueryDelegateKeysByOrchestratorAddressResponseSDKType>(endpoint, options);
  }
  /* GetPendingSendToEth */


  async getPendingSendToEth(params: QueryPendingSendToEth): Promise<QueryPendingSendToEthResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.senderAddress !== "undefined") {
      options.params.sender_address = params.senderAddress;
    }

    const endpoint = `gravity/v1beta/query_pending_send_to_eth`;
    return await this.req.get<QueryPendingSendToEthResponseSDKType>(endpoint, options);
  }
  /* GetPendingIbcAutoForwards */


  async getPendingIbcAutoForwards(params: QueryPendingIbcAutoForwards): Promise<QueryPendingIbcAutoForwardsResponseSDKType> {
    const options: any = {
      params: {}
    };

    if (typeof params?.limit !== "undefined") {
      options.params.limit = params.limit;
    }

    const endpoint = `gravity/v1beta/query_pending_ibc_auto_forwards`;
    return await this.req.get<QueryPendingIbcAutoForwardsResponseSDKType>(endpoint, options);
  }

}