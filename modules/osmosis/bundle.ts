import * as _135 from "./epochs/genesis";
import * as _136 from "./epochs/query";
import * as _137 from "./gamm/pool-models/balancer/balancerPool";
import * as _138 from "./gamm/v1beta1/genesis";
import * as _139 from "./gamm/v1beta1/query";
import * as _140 from "./gamm/v1beta1/tx";
import * as _141 from "./gamm/pool-models/balancer/tx/tx";
import * as _142 from "./gamm/pool-models/stableswap/stableswap_pool";
import * as _143 from "./gamm/pool-models/stableswap/tx";
import * as _144 from "./incentives/gauge";
import * as _145 from "./incentives/genesis";
import * as _146 from "./incentives/params";
import * as _147 from "./incentives/query";
import * as _148 from "./incentives/tx";
import * as _149 from "./lockup/genesis";
import * as _150 from "./lockup/lock";
import * as _151 from "./lockup/query";
import * as _152 from "./lockup/tx";
import * as _153 from "./mint/v1beta1/genesis";
import * as _154 from "./mint/v1beta1/mint";
import * as _155 from "./mint/v1beta1/query";
import * as _156 from "./pool-incentives/v1beta1/genesis";
import * as _157 from "./pool-incentives/v1beta1/gov";
import * as _158 from "./pool-incentives/v1beta1/incentives";
import * as _159 from "./pool-incentives/v1beta1/query";
import * as _160 from "./store/v1beta1/tree";
import * as _161 from "./streamswap/v1/event";
import * as _162 from "./streamswap/v1/genesis";
import * as _163 from "./streamswap/v1/params";
import * as _164 from "./streamswap/v1/query";
import * as _165 from "./streamswap/v1/state";
import * as _166 from "./streamswap/v1/tx";
import * as _167 from "./superfluid/genesis";
import * as _168 from "./superfluid/params";
import * as _169 from "./superfluid/query";
import * as _170 from "./superfluid/superfluid";
import * as _171 from "./superfluid/tx";
import * as _172 from "./tokenfactory/v1beta1/authorityMetadata";
import * as _173 from "./tokenfactory/v1beta1/genesis";
import * as _174 from "./tokenfactory/v1beta1/params";
import * as _175 from "./tokenfactory/v1beta1/query";
import * as _176 from "./tokenfactory/v1beta1/tx";
import * as _177 from "./twap/v1beta1/genesis";
import * as _178 from "./twap/v1beta1/query";
import * as _179 from "./twap/v1beta1/twap_record";
import * as _180 from "./txfees/v1beta1/feetoken";
import * as _181 from "./txfees/v1beta1/genesis";
import * as _182 from "./txfees/v1beta1/gov";
import * as _183 from "./txfees/v1beta1/query";
import * as _298 from "./gamm/pool-models/balancer/tx/tx.amino";
import * as _299 from "./gamm/pool-models/stableswap/tx.amino";
import * as _300 from "./gamm/v1beta1/tx.amino";
import * as _301 from "./incentives/tx.amino";
import * as _302 from "./lockup/tx.amino";
import * as _303 from "./streamswap/v1/tx.amino";
import * as _304 from "./superfluid/tx.amino";
import * as _305 from "./tokenfactory/v1beta1/tx.amino";
import * as _306 from "./gamm/pool-models/balancer/tx/tx.registry";
import * as _307 from "./gamm/pool-models/stableswap/tx.registry";
import * as _308 from "./gamm/v1beta1/tx.registry";
import * as _309 from "./incentives/tx.registry";
import * as _310 from "./lockup/tx.registry";
import * as _311 from "./streamswap/v1/tx.registry";
import * as _312 from "./superfluid/tx.registry";
import * as _313 from "./tokenfactory/v1beta1/tx.registry";
import * as _314 from "./epochs/query.lcd";
import * as _315 from "./gamm/v1beta1/query.lcd";
import * as _316 from "./incentives/query.lcd";
import * as _317 from "./lockup/query.lcd";
import * as _318 from "./mint/v1beta1/query.lcd";
import * as _319 from "./pool-incentives/v1beta1/query.lcd";
import * as _320 from "./streamswap/v1/query.lcd";
import * as _321 from "./superfluid/query.lcd";
import * as _322 from "./tokenfactory/v1beta1/query.lcd";
import * as _323 from "./twap/v1beta1/query.lcd";
import * as _324 from "./txfees/v1beta1/query.lcd";
import * as _325 from "./epochs/query.rpc.query";
import * as _326 from "./gamm/v1beta1/query.rpc.query";
import * as _327 from "./incentives/query.rpc.query";
import * as _328 from "./lockup/query.rpc.query";
import * as _329 from "./mint/v1beta1/query.rpc.query";
import * as _330 from "./pool-incentives/v1beta1/query.rpc.query";
import * as _331 from "./streamswap/v1/query.rpc.query";
import * as _332 from "./superfluid/query.rpc.query";
import * as _333 from "./tokenfactory/v1beta1/query.rpc.query";
import * as _334 from "./twap/v1beta1/query.rpc.query";
import * as _335 from "./txfees/v1beta1/query.rpc.query";
import * as _336 from "./gamm/pool-models/balancer/tx/tx.rpc.msg";
import * as _337 from "./gamm/pool-models/stableswap/tx.rpc.msg";
import * as _338 from "./gamm/v1beta1/tx.rpc.msg";
import * as _339 from "./incentives/tx.rpc.msg";
import * as _340 from "./lockup/tx.rpc.msg";
import * as _341 from "./streamswap/v1/tx.rpc.msg";
import * as _342 from "./superfluid/tx.rpc.msg";
import * as _343 from "./tokenfactory/v1beta1/tx.rpc.msg";
import * as _353 from "./lcd";
import * as _354 from "./rpc.query";
import * as _355 from "./rpc.tx";
export namespace osmosis {
  export namespace epochs {
    export const v1beta1 = { ..._135,
      ..._136,
      ..._314,
      ..._325
    };
  }
  export namespace gamm {
    export const v1beta1 = { ..._137,
      ..._138,
      ..._139,
      ..._140,
      ..._300,
      ..._308,
      ..._315,
      ..._326,
      ..._338
    };
    export namespace poolmodels {
      export namespace balancer {
        export const v1beta1 = { ..._141,
          ..._298,
          ..._306,
          ..._336
        };
      }
      export namespace stableswap {
        export const v1beta1 = { ..._142,
          ..._143,
          ..._299,
          ..._307,
          ..._337
        };
      }
    }
  }
  export const incentives = { ..._144,
    ..._145,
    ..._146,
    ..._147,
    ..._148,
    ..._301,
    ..._309,
    ..._316,
    ..._327,
    ..._339
  };
  export const lockup = { ..._149,
    ..._150,
    ..._151,
    ..._152,
    ..._302,
    ..._310,
    ..._317,
    ..._328,
    ..._340
  };
  export namespace mint {
    export const v1beta1 = { ..._153,
      ..._154,
      ..._155,
      ..._318,
      ..._329
    };
  }
  export namespace poolincentives {
    export const v1beta1 = { ..._156,
      ..._157,
      ..._158,
      ..._159,
      ..._319,
      ..._330
    };
  }
  export namespace store {
    export const v1beta1 = { ..._160
    };
  }
  export namespace streamswap {
    export const v1 = { ..._161,
      ..._162,
      ..._163,
      ..._164,
      ..._165,
      ..._166,
      ..._303,
      ..._311,
      ..._320,
      ..._331,
      ..._341
    };
  }
  export const superfluid = { ..._167,
    ..._168,
    ..._169,
    ..._170,
    ..._171,
    ..._304,
    ..._312,
    ..._321,
    ..._332,
    ..._342
  };
  export namespace tokenfactory {
    export const v1beta1 = { ..._172,
      ..._173,
      ..._174,
      ..._175,
      ..._176,
      ..._305,
      ..._313,
      ..._322,
      ..._333,
      ..._343
    };
  }
  export namespace twap {
    export const v1beta1 = { ..._177,
      ..._178,
      ..._179,
      ..._323,
      ..._334
    };
  }
  export namespace txfees {
    export const v1beta1 = { ..._180,
      ..._181,
      ..._182,
      ..._183,
      ..._324,
      ..._335
    };
  }
  export const ClientFactory = { ..._353,
    ..._354,
    ..._355
  };
}