import Axios from 'axios';
import {getBalanceUrl} from "../constants/url";
import {
    BALANCE_FETCH_SUCCESS,
    BALANCE_FETCH_ERROR,
    BALANCE_FETCH_IN_PROGRESS,
    BALANCE_LIST_FETCH_SUCCESS,
    TRANSFERABLE_BALANCE_LIST_FETCH_SUCCESS,
    VESTING_BALANCE_FETCH_SUCCESS
} from "../constants/balance";
import MakePersistence from "../utils/cosmosjsWrapper";
import vestingAccount from "../utils/vestingAmount";
import transactions from "../utils/transactions";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {createProtobufRpcClient, QueryClient} from "@cosmjs/stargate";
import {QueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/query";
const tendermintRPCURL =  process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

export const fetchBalanceProgress = () => {
    return {
        type: BALANCE_FETCH_IN_PROGRESS,
    };
};
export const fetchBalanceSuccess = (data) => {
    return {
        type: BALANCE_FETCH_SUCCESS,
        data,
    };
};
export const fetchBalanceError = (data) => {
    return {
        type: BALANCE_FETCH_ERROR,
        data,
    };
};

export const fetchBalanceListSuccess = (list) => {
    return {
        type: BALANCE_LIST_FETCH_SUCCESS,
        list,
    };
};

export const fetchBalance = (address) => {
    return async dispatch => {
        dispatch(fetchBalanceProgress());
        const url = getBalanceUrl(address);
        const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
        const queryClient = new QueryClient(tendermintClient);
        const rpcClient = createProtobufRpcClient(queryClient);

        const stakingQueryService = new QueryClientImpl(rpcClient);
        const allBalancesResponse = await stakingQueryService.AllBalances({
            address: address,
        });
        console.log(allBalancesResponse, "allBalancesResponse");
        await Axios.get(url)
            .then((res) => {
                if (res.data.balances.length) {
                    dispatch(fetchBalanceListSuccess(res.data.balances));
                    console.log(res.data.balances, "res.data.balances");
                    res.data.balances.forEach((item) => {
                        if(item.denom === 'uxprt'){
                            const totalBalance = item.amount*1;
                            dispatch(fetchBalanceSuccess(transactions.XprtConversion(totalBalance)));
                        }
                    });
                }
            })
            .catch((error) => {
                dispatch(fetchBalanceError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    };
};

export const fetchTransferableBalanceSuccess = (data) => {
    return {
        type: TRANSFERABLE_BALANCE_LIST_FETCH_SUCCESS,
        data,
    };
};

export const fetchVestingBalanceSuccess = (data) => {
    return {
        type: VESTING_BALANCE_FETCH_SUCCESS,
        data,
    };
};

export const fetchTransferableVestingAmount = (address)=> {
    return async dispatch => {
        const persistence = MakePersistence(0, 0);
        const vestingAmountData = await persistence.getAccounts(address);
        const currentEpochTime = Math.floor(new Date().getTime() / 1000);
        let vestingAmount = 0;
        let transferableAmount = 0;
        if (vestingAmountData.code === undefined) {
            const url = getBalanceUrl(address);
            await Axios.get(url)
                .then((res) => {
                    if (res.data.balances.length) {
                        res.data.balances.forEach((item) => {
                            if(item.denom === 'uxprt'){
                                const amount = transactions.XprtConversion(vestingAccount.getAccountVestingAmount(vestingAmountData.account, currentEpochTime));
                                const balance = transactions.XprtConversion(item.amount*1);
                                vestingAmount = amount;
                                if ((balance - amount) < 0) {
                                    transferableAmount = 0;
                                } else {
                                    transferableAmount = balance - amount;
                                }
                                dispatch(fetchTransferableBalanceSuccess(transferableAmount));
                                dispatch(fetchVestingBalanceSuccess(vestingAmount));
                            }
                        });
                    }
                })
                .catch((error) => {
                    dispatch(fetchBalanceError(error.response
                        ? error.response.data.message
                        : error.message));
                });

        }
    };
};
