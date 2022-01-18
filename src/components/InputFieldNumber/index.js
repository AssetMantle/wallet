import React from 'react';
import {Form} from "react-bootstrap";
import {emptyFunc} from "../../utils/scripts";

const InputFieldNumber = ({
    className,
    name,
    error,
    placeholder,
    required = true,
    type = 'number',
    value,
    max = '',
    onChange,
    min = '',
    onBlur = emptyFunc,
    onKeyPress = emptyFunc,
}) => {

    return (
        <div className="form-control-section flex-fill">
            <Form.Control
                className={className}
                min={min}
                name={name}
                max={max}
                placeholder={placeholder}
                required={required}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onKeyPress={onKeyPress}
            />
            <p className="input-error">{error.message}</p>
        </div>
    );
};


export default InputFieldNumber;
