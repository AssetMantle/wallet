import { ERC20Token, ERC20TokenSDKType } from "./attestation";
import { Long, DeepPartial } from "../../helpers";
import * as _m0 from "protobufjs/minimal";
/** OutgoingTxBatch represents a batch of transactions going from gravity to ETH */

export interface OutgoingTxBatch {
  batchNonce: Long;
  batchTimeout: Long;
  transactions: OutgoingTransferTx[];
  tokenContract: string;
  cosmosBlockCreated: Long;
}
/** OutgoingTxBatch represents a batch of transactions going from gravity to ETH */

export interface OutgoingTxBatchSDKType {
  batch_nonce: Long;
  batch_timeout: Long;
  transactions: OutgoingTransferTxSDKType[];
  token_contract: string;
  cosmos_block_created: Long;
}
/** OutgoingTransferTx represents an individual send from gravity to ETH */

export interface OutgoingTransferTx {
  id: Long;
  sender: string;
  destAddress: string;
  erc20Token?: ERC20Token;
  erc20Fee?: ERC20Token;
}
/** OutgoingTransferTx represents an individual send from gravity to ETH */

export interface OutgoingTransferTxSDKType {
  id: Long;
  sender: string;
  dest_address: string;
  erc20_token?: ERC20TokenSDKType;
  erc20_fee?: ERC20TokenSDKType;
}
/** OutgoingLogicCall represents an individual logic call from gravity to ETH */

export interface OutgoingLogicCall {
  transfers: ERC20Token[];
  fees: ERC20Token[];
  logicContractAddress: string;
  payload: Uint8Array;
  timeout: Long;
  invalidationId: Uint8Array;
  invalidationNonce: Long;
  cosmosBlockCreated: Long;
}
/** OutgoingLogicCall represents an individual logic call from gravity to ETH */

export interface OutgoingLogicCallSDKType {
  transfers: ERC20TokenSDKType[];
  fees: ERC20TokenSDKType[];
  logic_contract_address: string;
  payload: Uint8Array;
  timeout: Long;
  invalidation_id: Uint8Array;
  invalidation_nonce: Long;
  cosmos_block_created: Long;
}
export interface EventOutgoingBatchCanceled {
  bridgeContract: string;
  bridgeChainId: string;
  batchId: string;
  nonce: string;
}
export interface EventOutgoingBatchCanceledSDKType {
  bridge_contract: string;
  bridge_chain_id: string;
  batch_id: string;
  nonce: string;
}
export interface EventOutgoingBatch {
  bridgeContract: string;
  bridgeChainId: string;
  batchId: string;
  nonce: string;
}
export interface EventOutgoingBatchSDKType {
  bridge_contract: string;
  bridge_chain_id: string;
  batch_id: string;
  nonce: string;
}

function createBaseOutgoingTxBatch(): OutgoingTxBatch {
  return {
    batchNonce: Long.UZERO,
    batchTimeout: Long.UZERO,
    transactions: [],
    tokenContract: "",
    cosmosBlockCreated: Long.UZERO
  };
}

export const OutgoingTxBatch = {
  encode(message: OutgoingTxBatch, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.batchNonce.isZero()) {
      writer.uint32(8).uint64(message.batchNonce);
    }

    if (!message.batchTimeout.isZero()) {
      writer.uint32(16).uint64(message.batchTimeout);
    }

    for (const v of message.transactions) {
      OutgoingTransferTx.encode(v!, writer.uint32(26).fork()).ldelim();
    }

    if (message.tokenContract !== "") {
      writer.uint32(34).string(message.tokenContract);
    }

    if (!message.cosmosBlockCreated.isZero()) {
      writer.uint32(40).uint64(message.cosmosBlockCreated);
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutgoingTxBatch {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutgoingTxBatch();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.batchNonce = (reader.uint64() as Long);
          break;

        case 2:
          message.batchTimeout = (reader.uint64() as Long);
          break;

        case 3:
          message.transactions.push(OutgoingTransferTx.decode(reader, reader.uint32()));
          break;

        case 4:
          message.tokenContract = reader.string();
          break;

        case 5:
          message.cosmosBlockCreated = (reader.uint64() as Long);
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<OutgoingTxBatch>): OutgoingTxBatch {
    const message = createBaseOutgoingTxBatch();
    message.batchNonce = object.batchNonce !== undefined && object.batchNonce !== null ? Long.fromValue(object.batchNonce) : Long.UZERO;
    message.batchTimeout = object.batchTimeout !== undefined && object.batchTimeout !== null ? Long.fromValue(object.batchTimeout) : Long.UZERO;
    message.transactions = object.transactions?.map(e => OutgoingTransferTx.fromPartial(e)) || [];
    message.tokenContract = object.tokenContract ?? "";
    message.cosmosBlockCreated = object.cosmosBlockCreated !== undefined && object.cosmosBlockCreated !== null ? Long.fromValue(object.cosmosBlockCreated) : Long.UZERO;
    return message;
  }

};

function createBaseOutgoingTransferTx(): OutgoingTransferTx {
  return {
    id: Long.UZERO,
    sender: "",
    destAddress: "",
    erc20Token: undefined,
    erc20Fee: undefined
  };
}

export const OutgoingTransferTx = {
  encode(message: OutgoingTransferTx, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.id.isZero()) {
      writer.uint32(8).uint64(message.id);
    }

    if (message.sender !== "") {
      writer.uint32(18).string(message.sender);
    }

    if (message.destAddress !== "") {
      writer.uint32(26).string(message.destAddress);
    }

    if (message.erc20Token !== undefined) {
      ERC20Token.encode(message.erc20Token, writer.uint32(34).fork()).ldelim();
    }

    if (message.erc20Fee !== undefined) {
      ERC20Token.encode(message.erc20Fee, writer.uint32(42).fork()).ldelim();
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutgoingTransferTx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutgoingTransferTx();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.id = (reader.uint64() as Long);
          break;

        case 2:
          message.sender = reader.string();
          break;

        case 3:
          message.destAddress = reader.string();
          break;

        case 4:
          message.erc20Token = ERC20Token.decode(reader, reader.uint32());
          break;

        case 5:
          message.erc20Fee = ERC20Token.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<OutgoingTransferTx>): OutgoingTransferTx {
    const message = createBaseOutgoingTransferTx();
    message.id = object.id !== undefined && object.id !== null ? Long.fromValue(object.id) : Long.UZERO;
    message.sender = object.sender ?? "";
    message.destAddress = object.destAddress ?? "";
    message.erc20Token = object.erc20Token !== undefined && object.erc20Token !== null ? ERC20Token.fromPartial(object.erc20Token) : undefined;
    message.erc20Fee = object.erc20Fee !== undefined && object.erc20Fee !== null ? ERC20Token.fromPartial(object.erc20Fee) : undefined;
    return message;
  }

};

function createBaseOutgoingLogicCall(): OutgoingLogicCall {
  return {
    transfers: [],
    fees: [],
    logicContractAddress: "",
    payload: new Uint8Array(),
    timeout: Long.UZERO,
    invalidationId: new Uint8Array(),
    invalidationNonce: Long.UZERO,
    cosmosBlockCreated: Long.UZERO
  };
}

export const OutgoingLogicCall = {
  encode(message: OutgoingLogicCall, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.transfers) {
      ERC20Token.encode(v!, writer.uint32(10).fork()).ldelim();
    }

    for (const v of message.fees) {
      ERC20Token.encode(v!, writer.uint32(18).fork()).ldelim();
    }

    if (message.logicContractAddress !== "") {
      writer.uint32(26).string(message.logicContractAddress);
    }

    if (message.payload.length !== 0) {
      writer.uint32(34).bytes(message.payload);
    }

    if (!message.timeout.isZero()) {
      writer.uint32(40).uint64(message.timeout);
    }

    if (message.invalidationId.length !== 0) {
      writer.uint32(50).bytes(message.invalidationId);
    }

    if (!message.invalidationNonce.isZero()) {
      writer.uint32(56).uint64(message.invalidationNonce);
    }

    if (!message.cosmosBlockCreated.isZero()) {
      writer.uint32(64).uint64(message.cosmosBlockCreated);
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutgoingLogicCall {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutgoingLogicCall();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.transfers.push(ERC20Token.decode(reader, reader.uint32()));
          break;

        case 2:
          message.fees.push(ERC20Token.decode(reader, reader.uint32()));
          break;

        case 3:
          message.logicContractAddress = reader.string();
          break;

        case 4:
          message.payload = reader.bytes();
          break;

        case 5:
          message.timeout = (reader.uint64() as Long);
          break;

        case 6:
          message.invalidationId = reader.bytes();
          break;

        case 7:
          message.invalidationNonce = (reader.uint64() as Long);
          break;

        case 8:
          message.cosmosBlockCreated = (reader.uint64() as Long);
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<OutgoingLogicCall>): OutgoingLogicCall {
    const message = createBaseOutgoingLogicCall();
    message.transfers = object.transfers?.map(e => ERC20Token.fromPartial(e)) || [];
    message.fees = object.fees?.map(e => ERC20Token.fromPartial(e)) || [];
    message.logicContractAddress = object.logicContractAddress ?? "";
    message.payload = object.payload ?? new Uint8Array();
    message.timeout = object.timeout !== undefined && object.timeout !== null ? Long.fromValue(object.timeout) : Long.UZERO;
    message.invalidationId = object.invalidationId ?? new Uint8Array();
    message.invalidationNonce = object.invalidationNonce !== undefined && object.invalidationNonce !== null ? Long.fromValue(object.invalidationNonce) : Long.UZERO;
    message.cosmosBlockCreated = object.cosmosBlockCreated !== undefined && object.cosmosBlockCreated !== null ? Long.fromValue(object.cosmosBlockCreated) : Long.UZERO;
    return message;
  }

};

function createBaseEventOutgoingBatchCanceled(): EventOutgoingBatchCanceled {
  return {
    bridgeContract: "",
    bridgeChainId: "",
    batchId: "",
    nonce: ""
  };
}

export const EventOutgoingBatchCanceled = {
  encode(message: EventOutgoingBatchCanceled, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bridgeContract !== "") {
      writer.uint32(10).string(message.bridgeContract);
    }

    if (message.bridgeChainId !== "") {
      writer.uint32(18).string(message.bridgeChainId);
    }

    if (message.batchId !== "") {
      writer.uint32(26).string(message.batchId);
    }

    if (message.nonce !== "") {
      writer.uint32(34).string(message.nonce);
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventOutgoingBatchCanceled {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventOutgoingBatchCanceled();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.bridgeContract = reader.string();
          break;

        case 2:
          message.bridgeChainId = reader.string();
          break;

        case 3:
          message.batchId = reader.string();
          break;

        case 4:
          message.nonce = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<EventOutgoingBatchCanceled>): EventOutgoingBatchCanceled {
    const message = createBaseEventOutgoingBatchCanceled();
    message.bridgeContract = object.bridgeContract ?? "";
    message.bridgeChainId = object.bridgeChainId ?? "";
    message.batchId = object.batchId ?? "";
    message.nonce = object.nonce ?? "";
    return message;
  }

};

function createBaseEventOutgoingBatch(): EventOutgoingBatch {
  return {
    bridgeContract: "",
    bridgeChainId: "",
    batchId: "",
    nonce: ""
  };
}

export const EventOutgoingBatch = {
  encode(message: EventOutgoingBatch, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bridgeContract !== "") {
      writer.uint32(10).string(message.bridgeContract);
    }

    if (message.bridgeChainId !== "") {
      writer.uint32(18).string(message.bridgeChainId);
    }

    if (message.batchId !== "") {
      writer.uint32(26).string(message.batchId);
    }

    if (message.nonce !== "") {
      writer.uint32(34).string(message.nonce);
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventOutgoingBatch {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventOutgoingBatch();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.bridgeContract = reader.string();
          break;

        case 2:
          message.bridgeChainId = reader.string();
          break;

        case 3:
          message.batchId = reader.string();
          break;

        case 4:
          message.nonce = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<EventOutgoingBatch>): EventOutgoingBatch {
    const message = createBaseEventOutgoingBatch();
    message.bridgeContract = object.bridgeContract ?? "";
    message.bridgeChainId = object.bridgeChainId ?? "";
    message.batchId = object.batchId ?? "";
    message.nonce = object.nonce ?? "";
    return message;
  }

};