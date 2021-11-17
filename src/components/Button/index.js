import React from 'react';
import {Button as ReactButton} from "react-bootstrap";

const Button = ({
    className,
    value,
    onClick,
    disable = false
}) => {
    return (
        <ReactButton
            className={className}
            type="button"
            onClick={onClick}
            disabled={disable}
        >{value}
        </ReactButton>
    );
};

export default Button;
