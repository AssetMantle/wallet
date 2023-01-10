import * as _109 from "./epochs/genesis";
import * as _110 from "./epochs/query";
import * as _111 from "./gamm/pool-models/balancer/balancerPool";
import * as _112 from "./gamm/v1beta1/genesis";
import * as _113 from "./gamm/v1beta1/query";
import * as _114 from "./gamm/v1beta1/tx";
import * as _115 from "./gamm/pool-models/balancer/tx/tx";
import * as _116 from "./gamm/pool-models/stableswap/stableswap_pool";
import * as _117 from "./gamm/pool-models/stableswap/tx";
import * as _118 from "./incentives/gauge";
import * as _119 from "./incentives/genesis";
import * as _120 from "./incentives/params";
import * as _121 from "./incentives/query";
import * as _122 from "./incentives/tx";
import * as _123 from "./lockup/genesis";
import * as _124 from "./lockup/lock";
import * as _125 from "./lockup/query";
import * as _126 from "./lockup/tx";
import * as _127 from "./mint/v1beta1/genesis";
import * as _128 from "./mint/v1beta1/mint";
import * as _129 from "./mint/v1beta1/query";
import * as _130 from "./pool-incentives/v1beta1/genesis";
import * as _131 from "./pool-incentives/v1beta1/gov";
import * as _132 from "./pool-incentives/v1beta1/incentives";
import * as _133 from "./pool-incentives/v1beta1/query";
import * as _134 from "./store/v1beta1/tree";
import * as _135 from "./streamswap/v1/event";
import * as _136 from "./streamswap/v1/genesis";
import * as _137 from "./streamswap/v1/params";
import * as _138 from "./streamswap/v1/query";
import * as _139 from "./streamswap/v1/state";
import * as _140 from "./streamswap/v1/tx";
import * as _141 from "./superfluid/genesis";
import * as _142 from "./superfluid/params";
import * as _143 from "./superfluid/query";
import * as _144 from "./superfluid/superfluid";
import * as _145 from "./superfluid/tx";
import * as _146 from "./tokenfactory/v1beta1/authorityMetadata";
import * as _147 from "./tokenfactory/v1beta1/genesis";
import * as _148 from "./tokenfactory/v1beta1/params";
import * as _149 from "./tokenfactory/v1beta1/query";
import * as _150 from "./tokenfactory/v1beta1/tx";
import * as _151 from "./twap/v1beta1/genesis";
import * as _152 from "./twap/v1beta1/query";
import * as _153 from "./twap/v1beta1/twap_record";
import * as _154 from "./txfees/v1beta1/feetoken";
import * as _155 from "./txfees/v1beta1/genesis";
import * as _156 from "./txfees/v1beta1/gov";
import * as _157 from "./txfees/v1beta1/query";
import * as _251 from "./gamm/pool-models/balancer/tx/tx.amino";
import * as _252 from "./gamm/pool-models/stableswap/tx.amino";
import * as _253 from "./gamm/v1beta1/tx.amino";
import * as _254 from "./incentives/tx.amino";
import * as _255 from "./lockup/tx.amino";
import * as _256 from "./streamswap/v1/tx.amino";
import * as _257 from "./superfluid/tx.amino";
import * as _258 from "./tokenfactory/v1beta1/tx.amino";
import * as _259 from "./gamm/pool-models/balancer/tx/tx.registry";
import * as _260 from "./gamm/pool-models/stableswap/tx.registry";
import * as _261 from "./gamm/v1beta1/tx.registry";
import * as _262 from "./incentives/tx.registry";
import * as _263 from "./lockup/tx.registry";
import * as _264 from "./streamswap/v1/tx.registry";
import * as _265 from "./superfluid/tx.registry";
import * as _266 from "./tokenfactory/v1beta1/tx.registry";
import * as _267 from "./epochs/query.lcd";
import * as _268 from "./gamm/v1beta1/query.lcd";
import * as _269 from "./incentives/query.lcd";
import * as _270 from "./lockup/query.lcd";
import * as _271 from "./mint/v1beta1/query.lcd";
import * as _272 from "./pool-incentives/v1beta1/query.lcd";
import * as _273 from "./streamswap/v1/query.lcd";
import * as _274 from "./superfluid/query.lcd";
import * as _275 from "./tokenfactory/v1beta1/query.lcd";
import * as _276 from "./twap/v1beta1/query.lcd";
import * as _277 from "./txfees/v1beta1/query.lcd";
import * as _278 from "./epochs/query.rpc.Query";
import * as _279 from "./gamm/v1beta1/query.rpc.Query";
import * as _280 from "./incentives/query.rpc.Query";
import * as _281 from "./lockup/query.rpc.Query";
import * as _282 from "./mint/v1beta1/query.rpc.Query";
import * as _283 from "./pool-incentives/v1beta1/query.rpc.Query";
import * as _284 from "./streamswap/v1/query.rpc.Query";
import * as _285 from "./superfluid/query.rpc.Query";
import * as _286 from "./tokenfactory/v1beta1/query.rpc.Query";
import * as _287 from "./twap/v1beta1/query.rpc.Query";
import * as _288 from "./txfees/v1beta1/query.rpc.Query";
import * as _289 from "./gamm/pool-models/balancer/tx/tx.rpc.msg";
import * as _290 from "./gamm/pool-models/stableswap/tx.rpc.msg";
import * as _291 from "./gamm/v1beta1/tx.rpc.msg";
import * as _292 from "./incentives/tx.rpc.msg";
import * as _293 from "./lockup/tx.rpc.msg";
import * as _294 from "./streamswap/v1/tx.rpc.msg";
import * as _295 from "./superfluid/tx.rpc.msg";
import * as _296 from "./tokenfactory/v1beta1/tx.rpc.msg";
import * as _303 from "./lcd";
import * as _304 from "./rpc.query";
import * as _305 from "./rpc.tx";
export namespace osmosis {
  export namespace epochs {
    export const v1beta1 = { ..._109,
      ..._110,
      ..._267,
      ..._278
    };
  }
  export namespace gamm {
    export const v1beta1 = { ..._111,
      ..._112,
      ..._113,
      ..._114,
      ..._253,
      ..._261,
      ..._268,
      ..._279,
      ..._291
    };
    export namespace poolmodels {
      export namespace balancer {
        export const v1beta1 = { ..._115,
          ..._251,
          ..._259,
          ..._289
        };
      }
      export namespace stableswap {
        export const v1beta1 = { ..._116,
          ..._117,
          ..._252,
          ..._260,
          ..._290
        };
      }
    }
  }
  export const incentives = { ..._118,
    ..._119,
    ..._120,
    ..._121,
    ..._122,
    ..._254,
    ..._262,
    ..._269,
    ..._280,
    ..._292
  };
  export const lockup = { ..._123,
    ..._124,
    ..._125,
    ..._126,
    ..._255,
    ..._263,
    ..._270,
    ..._281,
    ..._293
  };
  export namespace mint {
    export const v1beta1 = { ..._127,
      ..._128,
      ..._129,
      ..._271,
      ..._282
    };
  }
  export namespace poolincentives {
    export const v1beta1 = { ..._130,
      ..._131,
      ..._132,
      ..._133,
      ..._272,
      ..._283
    };
  }
  export namespace store {
    export const v1beta1 = { ..._134
    };
  }
  export namespace streamswap {
    export const v1 = { ..._135,
      ..._136,
      ..._137,
      ..._138,
      ..._139,
      ..._140,
      ..._256,
      ..._264,
      ..._273,
      ..._284,
      ..._294
    };
  }
  export const superfluid = { ..._141,
    ..._142,
    ..._143,
    ..._144,
    ..._145,
    ..._257,
    ..._265,
    ..._274,
    ..._285,
    ..._295
  };
  export namespace tokenfactory {
    export const v1beta1 = { ..._146,
      ..._147,
      ..._148,
      ..._149,
      ..._150,
      ..._258,
      ..._266,
      ..._275,
      ..._286,
      ..._296
    };
  }
  export namespace twap {
    export const v1beta1 = { ..._151,
      ..._152,
      ..._153,
      ..._276,
      ..._287
    };
  }
  export namespace txfees {
    export const v1beta1 = { ..._154,
      ..._155,
      ..._156,
      ..._157,
      ..._277,
      ..._288
    };
  }
  export const ClientFactory = { ..._303,
    ..._304,
    ..._305
  };
}