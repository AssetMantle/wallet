import Axios from 'axios';
import {getWithdrawAddressUrl} from "../constants/url";
import {
    FETCH_WITHDRAW_ADDRESS_ERROR,
    FETCH_WITHDRAW_ADDRESS_SUCCESS
} from "../constants/withdrawAddress"

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
    }
};
