import {
    FETCH_WITHDRAW_ADDRESS_ERROR,
    FETCH_WITHDRAW_ADDRESS_SUCCESS
} from "../constants/withdrawAddress";
import {QueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/query";
import transactions from "../utils/transactions";

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
        const rpcClient = await transactions.RpcClient();

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
