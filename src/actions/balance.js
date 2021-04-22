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
        await Axios.get(url)
            .then((res) => {
                if (res.data.balances.length) {
                    dispatch(fetchBalanceListSuccess(res.data.balances));
                    res.data.balances.forEach((item) => {
                        if(item.denom === 'uxprt'){
                            const totalBalance = item.amount*1;
                            dispatch(fetchBalanceSuccess((totalBalance / 1000000)));
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
                                const balance = (item.amount*1/1000000);
                                const amount = vestingAccount.getAccountVestingAmount(vestingAmountData.account, currentEpochTime) / 1000000;
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
