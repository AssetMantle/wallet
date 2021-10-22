import React from "react";
const NumberView = (props) => {
    return (
        Array.isArray(props.data) ?
            <span className="digits"><span className="start">{props.data[0]}</span>.<span className="end">{props.data[1]} </span></span>
            :  <span className="digits"><span className="start">{props.data}</span></span>
        
    );
};
export default NumberView;