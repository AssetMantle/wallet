import React from 'react';
import {Form} from "react-bootstrap";
import './index.css';
import helper from "../../utils/helper";

const InputText = ({
    autofocus = false,
    className,
    error,
    name,
    placeholder,
    required = true,
    type = 'text',
    value,
    onChange = helper.emptyFunc,
    onKeyPress = helper.emptyFunc,
    onBlur = helper.emptyFunc,
})=>{
    return (
        <div className="form-control-section flex-fill">
            <Form.Control
                type={type}
                className={className}
                name={name}
                onKeyPress={onKeyPress}
                placeholder={placeholder}
                autoFocus={autofocus}
                defaultValue={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
            />
            <p className="input-error">{error.message}</p>
        </div>
    );
};
export default InputText;

