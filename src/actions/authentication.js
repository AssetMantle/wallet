import {LOGIN_SUCCESS} from "../constants/authentication"

export const login = (mode)  => {
    return {
        type: LOGIN_SUCCESS,
        mode,
    };
};
