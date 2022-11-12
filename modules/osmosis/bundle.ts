import * as _101 from "./epochs/genesis";
import * as _102 from "./epochs/query";
import * as _103 from "./gamm/pool-models/balancer/balancerPool";
import * as _104 from "./gamm/v1beta1/genesis";
import * as _105 from "./gamm/v1beta1/query";
import * as _106 from "./gamm/v1beta1/tx";
import * as _107 from "./gamm/pool-models/balancer/tx/tx";
import * as _108 from "./gamm/pool-models/stableswap/stableswap_pool";
import * as _109 from "./gamm/pool-models/stableswap/tx";
import * as _110 from "./incentives/gauge";
import * as _111 from "./incentives/genesis";
import * as _112 from "./incentives/params";
import * as _113 from "./incentives/query";
import * as _114 from "./incentives/tx";
import * as _115 from "./lockup/genesis";
import * as _116 from "./lockup/lock";
import * as _117 from "./lockup/query";
import * as _118 from "./lockup/tx";
import * as _119 from "./mint/v1beta1/genesis";
import * as _120 from "./mint/v1beta1/mint";
import * as _121 from "./mint/v1beta1/query";
import * as _122 from "./pool-incentives/v1beta1/genesis";
import * as _123 from "./pool-incentives/v1beta1/gov";
import * as _124 from "./pool-incentives/v1beta1/incentives";
import * as _125 from "./pool-incentives/v1beta1/query";
import * as _126 from "./store/v1beta1/tree";
import * as _127 from "./streamswap/v1/event";
import * as _128 from "./streamswap/v1/genesis";
import * as _129 from "./streamswap/v1/params";
import * as _130 from "./streamswap/v1/query";
import * as _131 from "./streamswap/v1/state";
import * as _132 from "./streamswap/v1/tx";
import * as _133 from "./superfluid/genesis";
import * as _134 from "./superfluid/params";
import * as _135 from "./superfluid/query";
import * as _136 from "./superfluid/superfluid";
import * as _137 from "./superfluid/tx";
import * as _138 from "./tokenfactory/v1beta1/authorityMetadata";
import * as _139 from "./tokenfactory/v1beta1/genesis";
import * as _140 from "./tokenfactory/v1beta1/params";
import * as _141 from "./tokenfactory/v1beta1/query";
import * as _142 from "./tokenfactory/v1beta1/tx";
import * as _143 from "./twap/v1beta1/genesis";
import * as _144 from "./twap/v1beta1/query";
import * as _145 from "./twap/v1beta1/twap_record";
import * as _146 from "./txfees/v1beta1/feetoken";
import * as _147 from "./txfees/v1beta1/genesis";
import * as _148 from "./txfees/v1beta1/gov";
import * as _149 from "./txfees/v1beta1/query";
import * as _210 from "./epochs/query.lcd";
import * as _211 from "./gamm/v1beta1/query.lcd";
import * as _212 from "./incentives/query.lcd";
import * as _213 from "./lockup/query.lcd";
import * as _214 from "./mint/v1beta1/query.lcd";
import * as _215 from "./pool-incentives/v1beta1/query.lcd";
import * as _216 from "./streamswap/v1/query.lcd";
import * as _217 from "./superfluid/query.lcd";
import * as _218 from "./tokenfactory/v1beta1/query.lcd";
import * as _219 from "./twap/v1beta1/query.lcd";
import * as _220 from "./txfees/v1beta1/query.lcd";
import * as _221 from "./epochs/query.rpc.Query";
import * as _222 from "./gamm/v1beta1/query.rpc.Query";
import * as _223 from "./incentives/query.rpc.Query";
import * as _224 from "./lockup/query.rpc.Query";
import * as _225 from "./mint/v1beta1/query.rpc.Query";
import * as _226 from "./pool-incentives/v1beta1/query.rpc.Query";
import * as _227 from "./streamswap/v1/query.rpc.Query";
import * as _228 from "./superfluid/query.rpc.Query";
import * as _229 from "./tokenfactory/v1beta1/query.rpc.Query";
import * as _230 from "./twap/v1beta1/query.rpc.Query";
import * as _231 from "./txfees/v1beta1/query.rpc.Query";
import * as _232 from "./gamm/pool-models/balancer/tx/tx.rpc.msg";
import * as _233 from "./gamm/pool-models/stableswap/tx.rpc.msg";
import * as _234 from "./gamm/v1beta1/tx.rpc.msg";
import * as _235 from "./incentives/tx.rpc.msg";
import * as _236 from "./lockup/tx.rpc.msg";
import * as _237 from "./streamswap/v1/tx.rpc.msg";
import * as _238 from "./superfluid/tx.rpc.msg";
import * as _239 from "./tokenfactory/v1beta1/tx.rpc.msg";
import * as _243 from "./lcd";
import * as _244 from "./rpc.query";
import * as _245 from "./rpc.tx";
export namespace osmosis {
  export namespace epochs {
    export const v1beta1 = { ..._101,
      ..._102,
      ..._210,
      ..._221
    };
  }
  export namespace gamm {
    export const v1beta1 = { ..._103,
      ..._104,
      ..._105,
      ..._106,
      ..._211,
      ..._222,
      ..._234
    };
    export namespace poolmodels {
      export namespace balancer {
        export const v1beta1 = { ..._107,
          ..._232
        };
      }
      export namespace stableswap {
        export const v1beta1 = { ..._108,
          ..._109,
          ..._233
        };
      }
    }
  }
  export const incentives = { ..._110,
    ..._111,
    ..._112,
    ..._113,
    ..._114,
    ..._212,
    ..._223,
    ..._235
  };
  export const lockup = { ..._115,
    ..._116,
    ..._117,
    ..._118,
    ..._213,
    ..._224,
    ..._236
  };
  export namespace mint {
    export const v1beta1 = { ..._119,
      ..._120,
      ..._121,
      ..._214,
      ..._225
    };
  }
  export namespace poolincentives {
    export const v1beta1 = { ..._122,
      ..._123,
      ..._124,
      ..._125,
      ..._215,
      ..._226
    };
  }
  export namespace store {
    export const v1beta1 = { ..._126
    };
  }
  export namespace streamswap {
    export const v1 = { ..._127,
      ..._128,
      ..._129,
      ..._130,
      ..._131,
      ..._132,
      ..._216,
      ..._227,
      ..._237
    };
  }
  export const superfluid = { ..._133,
    ..._134,
    ..._135,
    ..._136,
    ..._137,
    ..._217,
    ..._228,
    ..._238
  };
  export namespace tokenfactory {
    export const v1beta1 = { ..._138,
      ..._139,
      ..._140,
      ..._141,
      ..._142,
      ..._218,
      ..._229,
      ..._239
    };
  }
  export namespace twap {
    export const v1beta1 = { ..._143,
      ..._144,
      ..._145,
      ..._219,
      ..._230
    };
  }
  export namespace txfees {
    export const v1beta1 = { ..._146,
      ..._147,
      ..._148,
      ..._149,
      ..._220,
      ..._231
    };
  }
  export const ClientFactory = { ..._243,
    ..._244,
    ..._245
  };
}