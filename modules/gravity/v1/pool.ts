import * as _m0 from "protobufjs/minimal";
import { Long, DeepPartial } from "../../helpers";
/** IDSet represents a set of IDs */

export interface IDSet {
  /** IDSet represents a set of IDs */
  ids: Long[];
}
/** IDSet represents a set of IDs */

export interface IDSetSDKType {
  ids: Long[];
}
export interface BatchFees {
  token: string;
  totalFees: string;
  txCount: Long;
}
export interface BatchFeesSDKType {
  token: string;
  total_fees: string;
  tx_count: Long;
}
export interface EventWithdrawalReceived {
  bridgeContract: string;
  bridgeChainId: string;
  outgoingTxId: string;
  nonce: string;
}
export interface EventWithdrawalReceivedSDKType {
  bridge_contract: string;
  bridge_chain_id: string;
  outgoing_tx_id: string;
  nonce: string;
}
export interface EventWithdrawCanceled {
  sender: string;
  txId: string;
  bridgeContract: string;
  bridgeChainId: string;
}
export interface EventWithdrawCanceledSDKType {
  sender: string;
  tx_id: string;
  bridge_contract: string;
  bridge_chain_id: string;
}

function createBaseIDSet(): IDSet {
  return {
    ids: []
  };
}

export const IDSet = {
  encode(message: IDSet, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();

    for (const v of message.ids) {
      writer.uint64(v);
    }

    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IDSet {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIDSet();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;

            while (reader.pos < end2) {
              message.ids.push((reader.uint64() as Long));
            }
          } else {
            message.ids.push((reader.uint64() as Long));
          }

          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<IDSet>): IDSet {
    const message = createBaseIDSet();
    message.ids = object.ids?.map(e => Long.fromValue(e)) || [];
    return message;
  }

};

function createBaseBatchFees(): BatchFees {
  return {
    token: "",
    totalFees: "",
    txCount: Long.UZERO
  };
}

export const BatchFees = {
  encode(message: BatchFees, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }

    if (message.totalFees !== "") {
      writer.uint32(18).string(message.totalFees);
    }

    if (!message.txCount.isZero()) {
      writer.uint32(24).uint64(message.txCount);
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchFees {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchFees();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.token = reader.string();
          break;

        case 2:
          message.totalFees = reader.string();
          break;

        case 3:
          message.txCount = (reader.uint64() as Long);
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<BatchFees>): BatchFees {
    const message = createBaseBatchFees();
    message.token = object.token ?? "";
    message.totalFees = object.totalFees ?? "";
    message.txCount = object.txCount !== undefined && object.txCount !== null ? Long.fromValue(object.txCount) : Long.UZERO;
    return message;
  }

};

function createBaseEventWithdrawalReceived(): EventWithdrawalReceived {
  return {
    bridgeContract: "",
    bridgeChainId: "",
    outgoingTxId: "",
    nonce: ""
  };
}

export const EventWithdrawalReceived = {
  encode(message: EventWithdrawalReceived, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bridgeContract !== "") {
      writer.uint32(10).string(message.bridgeContract);
    }

    if (message.bridgeChainId !== "") {
      writer.uint32(18).string(message.bridgeChainId);
    }

    if (message.outgoingTxId !== "") {
      writer.uint32(26).string(message.outgoingTxId);
    }

    if (message.nonce !== "") {
      writer.uint32(34).string(message.nonce);
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventWithdrawalReceived {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventWithdrawalReceived();

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
          message.outgoingTxId = reader.string();
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

  fromPartial(object: DeepPartial<EventWithdrawalReceived>): EventWithdrawalReceived {
    const message = createBaseEventWithdrawalReceived();
    message.bridgeContract = object.bridgeContract ?? "";
    message.bridgeChainId = object.bridgeChainId ?? "";
    message.outgoingTxId = object.outgoingTxId ?? "";
    message.nonce = object.nonce ?? "";
    return message;
  }

};

function createBaseEventWithdrawCanceled(): EventWithdrawCanceled {
  return {
    sender: "",
    txId: "",
    bridgeContract: "",
    bridgeChainId: ""
  };
}

export const EventWithdrawCanceled = {
  encode(message: EventWithdrawCanceled, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }

    if (message.txId !== "") {
      writer.uint32(18).string(message.txId);
    }

    if (message.bridgeContract !== "") {
      writer.uint32(26).string(message.bridgeContract);
    }

    if (message.bridgeChainId !== "") {
      writer.uint32(34).string(message.bridgeChainId);
    }

    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventWithdrawCanceled {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventWithdrawCanceled();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;

        case 2:
          message.txId = reader.string();
          break;

        case 3:
          message.bridgeContract = reader.string();
          break;

        case 4:
          message.bridgeChainId = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },

  fromPartial(object: DeepPartial<EventWithdrawCanceled>): EventWithdrawCanceled {
    const message = createBaseEventWithdrawCanceled();
    message.sender = object.sender ?? "";
    message.txId = object.txId ?? "";
    message.bridgeContract = object.bridgeContract ?? "";
    message.bridgeChainId = object.bridgeChainId ?? "";
    return message;
  }

};