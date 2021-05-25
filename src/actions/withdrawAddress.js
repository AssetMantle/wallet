import {
    FETCH_WITHDRAW_ADDRESS_ERROR,
    FETCH_WITHDRAW_ADDRESS_SUCCESS
} from "../constants/withdrawAddress";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {createProtobufRpcClient, QueryClient} from "@cosmjs/stargate";
import {QueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/query";
const tendermintRPCURL =  process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

export const fetchAddressSuccess = (address) => {
    return {
        type: FETCH_WITHDRAW_ADDRESS_SUCCESS,
        address,
    };
};
export const fetchAddressError = (data) => {
    return {
        type: FETCH_WITHDRAW_ADDRESS_ERROR,
        data,
    };
};

export const fetchWithdrawAddress = (address) => {
    return async dispatch => {
        const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
        const queryClient = new QueryClient(tendermintClient);
        const rpcClient = createProtobufRpcClient(queryClient);

        const stakingQueryService = new QueryClientImpl(rpcClient);
        await stakingQueryService.DelegatorWithdrawAddress({
            delegatorAddress: address,
        }) .then((res) => {
            if (res.withdrawAddress) {
                dispatch(fetchAddressSuccess(res.withdrawAddress));
            }
        }).catch((error) => {
            dispatch(fetchAddressError(error.response
                ? error.response.data.message
                : error.message));
        });

    };
};
