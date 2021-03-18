import {
    DELEGATIONS_GET_SUCCESS,
    DELEGATIONS_GET_ERROR,
} from '../constants/Delegations';
import axios from "axios";
import {getDelegationsUrl} from "../constants/url";
//
// export const getDelegationsSuccess = (data) => {
//     return {
//         type: DELEGATIONS_GET_SUCCESS,
//         data,
//     };
// };
//
// export const getDelegationsError = (data) => {
//     return {
//         type: DELEGATIONS_GET_ERROR,
//         data,
//     };
// };

export const getDelegations = async (data) => {
    const url = getDelegationsUrl('persistence1xfg28czjxsf75x9th4kejrjv3n6t7wfcu6gjpe');
    const response = await axios.get(url);
    // getDelegationsSuccess(response.data.unbonding_responses[0])
    return {
        type: DELEGATIONS_GET_SUCCESS,
        data,
    };

};
