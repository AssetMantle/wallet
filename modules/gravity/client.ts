import { GeneratedType, Registry, OfflineSigner } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import { HttpEndpoint } from "@cosmjs/tendermint-rpc";
import * as gravityV1MsgsRegistry from "./v1/msgs.registry";
import * as gravityV1MsgsAmino from "./v1/msgs.amino";
export const gravityAminoConverters = { ...gravityV1MsgsAmino.AminoConverter
};
export const gravityProtoRegistry: ReadonlyArray<[string, GeneratedType]> = [...gravityV1MsgsRegistry.registry];
export const getSigningGravityClientOptions = ({
  defaultTypes = defaultRegistryTypes
}: {
  defaultTypes?: ReadonlyArray<[string, GeneratedType]>;
} = {}): {
  registry: Registry;
  aminoTypes: AminoTypes;
} => {
  const registry = new Registry([...defaultTypes, ...gravityProtoRegistry]);
  const aminoTypes = new AminoTypes({ ...gravityAminoConverters
  });
  return {
    registry,
    aminoTypes
  };
};
export const getSigningGravityClient = async ({
  rpcEndpoint,
  signer,
  defaultTypes = defaultRegistryTypes
}: {
  rpcEndpoint: string | HttpEndpoint;
  signer: OfflineSigner;
  defaultTypes?: ReadonlyArray<[string, GeneratedType]>;
}) => {
  const {
    registry,
    aminoTypes
  } = getSigningGravityClientOptions({
    defaultTypes
  });
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer, {
    registry,
    aminoTypes
  });
  return client;
};