import * as _118 from "./applications/transfer/v1/genesis";
import * as _119 from "./applications/transfer/v1/query";
import * as _120 from "./applications/transfer/v1/transfer";
import * as _121 from "./applications/transfer/v1/tx";
import * as _122 from "./applications/transfer/v2/packet";
import * as _123 from "./core/channel/v1/channel";
import * as _124 from "./core/channel/v1/genesis";
import * as _125 from "./core/channel/v1/query";
import * as _126 from "./core/channel/v1/tx";
import * as _127 from "./core/client/v1/client";
import * as _128 from "./core/client/v1/genesis";
import * as _129 from "./core/client/v1/query";
import * as _130 from "./core/client/v1/tx";
import * as _131 from "./core/commitment/v1/commitment";
import * as _132 from "./core/connection/v1/connection";
import * as _133 from "./core/connection/v1/genesis";
import * as _134 from "./core/connection/v1/query";
import * as _135 from "./core/connection/v1/tx";
import * as _136 from "./core/port/v1/query";
import * as _137 from "./core/types/v1/genesis";
import * as _138 from "./lightclients/localhost/v1/localhost";
import * as _139 from "./lightclients/solomachine/v1/solomachine";
import * as _140 from "./lightclients/solomachine/v2/solomachine";
import * as _141 from "./lightclients/tendermint/v1/tendermint";
import * as _240 from "./applications/transfer/v1/tx.amino";
import * as _241 from "./core/channel/v1/tx.amino";
import * as _242 from "./core/client/v1/tx.amino";
import * as _243 from "./core/connection/v1/tx.amino";
import * as _244 from "./applications/transfer/v1/tx.registry";
import * as _245 from "./core/channel/v1/tx.registry";
import * as _246 from "./core/client/v1/tx.registry";
import * as _247 from "./core/connection/v1/tx.registry";
import * as _248 from "./applications/transfer/v1/query.lcd";
import * as _249 from "./core/channel/v1/query.lcd";
import * as _250 from "./core/client/v1/query.lcd";
import * as _251 from "./core/connection/v1/query.lcd";
import * as _252 from "./applications/transfer/v1/query.rpc.Query";
import * as _253 from "./core/channel/v1/query.rpc.Query";
import * as _254 from "./core/client/v1/query.rpc.Query";
import * as _255 from "./core/connection/v1/query.rpc.Query";
import * as _256 from "./core/port/v1/query.rpc.Query";
import * as _257 from "./applications/transfer/v1/tx.rpc.msg";
import * as _258 from "./core/channel/v1/tx.rpc.msg";
import * as _259 from "./core/client/v1/tx.rpc.msg";
import * as _260 from "./core/connection/v1/tx.rpc.msg";
import * as _270 from "./lcd";
import * as _271 from "./rpc.query";
import * as _272 from "./rpc.tx";
export namespace ibc {
  export namespace applications {
    export namespace transfer {
      export const v1 = { ..._118,
        ..._119,
        ..._120,
        ..._121,
        ..._240,
        ..._244,
        ..._248,
        ..._252,
        ..._257
      };
      export const v2 = { ..._122
      };
    }
  }
  export namespace core {
    export namespace channel {
      export const v1 = { ..._123,
        ..._124,
        ..._125,
        ..._126,
        ..._241,
        ..._245,
        ..._249,
        ..._253,
        ..._258
      };
    }
    export namespace client {
      export const v1 = { ..._127,
        ..._128,
        ..._129,
        ..._130,
        ..._242,
        ..._246,
        ..._250,
        ..._254,
        ..._259
      };
    }
    export namespace commitment {
      export const v1 = { ..._131
      };
    }
    export namespace connection {
      export const v1 = { ..._132,
        ..._133,
        ..._134,
        ..._135,
        ..._243,
        ..._247,
        ..._251,
        ..._255,
        ..._260
      };
    }
    export namespace port {
      export const v1 = { ..._136,
        ..._256
      };
    }
    export namespace types {
      export const v1 = { ..._137
      };
    }
  }
  export namespace lightclients {
    export namespace localhost {
      export const v1 = { ..._138
      };
    }
    export namespace solomachine {
      export const v1 = { ..._139
      };
      export const v2 = { ..._140
      };
    }
    export namespace tendermint {
      export const v1 = { ..._141
      };
    }
  }
  export const ClientFactory = { ..._270,
    ..._271,
    ..._272
  };
}