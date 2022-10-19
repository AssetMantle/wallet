import React from 'react';
import Button from "../../../../components/Button";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import { cosmostationLogin } from '../../../../store/actions/signIn/cosmostation';

const ButtonContinue = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const onClick = () => {
        dispatch(cosmostationLogin(history));
    };

    return (
        <Button
            className="button button-primary"
            type="button"
            value="Continue"
            onClick={onClick}
        />
    );
};

export default ButtonContinue;
