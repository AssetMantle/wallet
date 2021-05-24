import Axios from 'axios';
import {getWithdrawAddressUrl} from "../constants/url";
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
        const url = getWithdrawAddressUrl(address);
        const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
        const queryClient = new QueryClient(tendermintClient);
        const rpcClient = createProtobufRpcClient(queryClient);

        const stakingQueryService = new QueryClientImpl(rpcClient);
        const withdrawAddressResponse = await stakingQueryService.DelegatorWithdrawAddress({
            delegatorAddr: address,
        });
        console.log(withdrawAddressResponse, "withdrawAddressResponse");
        await Axios.get(url)
            .then((res) => {
                if (res.data.withdraw_address) {
                    dispatch(fetchAddressSuccess(res.data.withdraw_address));
                }
            })
            .catch((error) => {
                dispatch(fetchAddressError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    };
};
