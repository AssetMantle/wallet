import * as _95 from "./wasm/v1/authz";
import * as _96 from "./wasm/v1/genesis";
import * as _97 from "./wasm/v1/ibc";
import * as _98 from "./wasm/v1/proposal";
import * as _99 from "./wasm/v1/query";
import * as _100 from "./wasm/v1/tx";
import * as _101 from "./wasm/v1/types";
import * as _230 from "./wasm/v1/tx.amino";
import * as _231 from "./wasm/v1/tx.registry";
import * as _232 from "./wasm/v1/query.lcd";
import * as _233 from "./wasm/v1/query.rpc.Query";
import * as _234 from "./wasm/v1/tx.rpc.msg";
import * as _264 from "./lcd";
import * as _265 from "./rpc.query";
import * as _266 from "./rpc.tx";
export namespace cosmwasm {
  export namespace wasm {
    export const v1 = { ..._95,
      ..._96,
      ..._97,
      ..._98,
      ..._99,
      ..._100,
      ..._101,
      ..._230,
      ..._231,
      ..._232,
      ..._233,
      ..._234
    };
  }
  export const ClientFactory = { ..._264,
    ..._265,
    ..._266
  };
}