import React from "react";
import {formatNumber} from "../../utils/scripts";
const NumberView = ({value = "0.000000"}) => {
    const split = value.split(".");
    return (
        <span className="digits">
            <span className="start">{formatNumber(split[0])}.</span>
            <span className="end">{split[1]} </span>
        </span>
        // Array.isArray(props.data) ?
        //     <span className="digits"><span className="start">{props.data[0]}</span>.<span className="end">{props.data[1]} </span></span>
        //     :  <span className="digits"><span className="start">{props.data}</span></span>
        
    );
};
export default NumberView;