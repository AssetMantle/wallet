import * as _103 from "./v1/attestation";
import * as _104 from "./v1/batch";
import * as _105 from "./v1/ethereum_signer";
import * as _106 from "./v1/genesis";
import * as _107 from "./v1/msgs";
import * as _108 from "./v1/pool";
import * as _109 from "./v1/query";
import * as _110 from "./v1/types";
import * as _223 from "./v1/msgs.amino";
import * as _224 from "./v1/msgs.registry";
import * as _225 from "./v1/query.lcd";
import * as _226 from "./v1/query.rpc.query";
import * as _227 from "./v1/msgs.rpc.msg";
import * as _252 from "./lcd";
import * as _253 from "./rpc.query";
import * as _254 from "./rpc.tx";
export namespace gravity {
  export const v1 = { ..._103,
    ..._104,
    ..._105,
    ..._106,
    ..._107,
    ..._108,
    ..._109,
    ..._110,
    ..._223,
    ..._224,
    ..._225,
    ..._226,
    ..._227
  };
  export const ClientFactory = { ..._252,
    ..._253,
    ..._254
  };
}