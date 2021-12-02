import {DELEGATIONS_FETCH_ERROR, DELEGATIONS_FETCH_SUCCESS, DELEGATIONS_STATUS_SUCCESS} from "../../constants/delegations";
import Lodash from "lodash";
import transactions from "../../utils/transactions";
import {QueryClientImpl} from "cosmjs-types/cosmos/staking/v1beta1/query";
import * as Sentry from "@sentry/browser";

export const fetchDelegationsCountSuccess = (count) => {
    return {
        type: DELEGATIONS_FETCH_SUCCESS,
        count,
    };
};
export const fetchProposalsCountError = (count) => {
    return {
        type: DELEGATIONS_FETCH_ERROR,
        count,
    };
};

export const fetchDelegationStatusSuccess = (value) => {
    return {
        type: DELEGATIONS_STATUS_SUCCESS,
        value,
    };
};


export const fetchDelegationsCount = (address) => {
    return async dispatch => {
        const rpcClient = await transactions.RpcClient();
        const stakingQueryService = new QueryClientImpl(rpcClient);
        await stakingQueryService.DelegatorDelegations({
            delegatorAddr: address,
        }).then((delegationsResponse) => {
            if (delegationsResponse.delegationResponses.length) {
                dispatch(fetchDelegationStatusSuccess(true));
                let totalDelegationsCount = Lodash.sumBy(delegationsResponse.delegationResponses, (delegation) => {
                    return delegation.balance.amount * 1;
                });
                dispatch(fetchDelegationsCountSuccess(transactions.XprtConversion(totalDelegationsCount)));
            }

        }).catch((error) => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            dispatch(fetchProposalsCountError(error.response
                ? error.response.data.message
                : error.message));
        });

    };
};
