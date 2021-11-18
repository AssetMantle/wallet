import React from 'react';
import Button from "../../../../components/Button";
import {useDispatch} from "react-redux";
import {keyStoreSubmit} from "../../../../actions/signIn/keyStore";

const Submit = () => {
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(keyStoreSubmit());

    };

    return (
        <div className="buttons">
            <div className="button-section">
                <Button
                    className="button button-primary"
                    type="button"
                    value="Next"
                    onClick={onClick}
                />
            </div>
        </div>
    );
};

export default Submit;
