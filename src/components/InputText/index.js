import React from 'react';
import {Form} from "react-bootstrap";
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
    onChange,
    onKeyPress= helper.emptyFunc,
    onBlur= helper.emptyFunc,
})=>{
    console.log(value ,"inputText");
    return (
        <div className="form-control-section flex-fill">
            <Form.Control
                type={type}
                className={className}
                name={name}
                onKeyPress={onKeyPress}
                placeholder={placeholder}
                required={required}
                autoFocus={autofocus}
                defaultValue={value}
                onChange={onChange}
                onBlur={onBlur}
            />
            <p className="input-error">{error.message}</p>
        </div>
    );
};
export default InputText;

