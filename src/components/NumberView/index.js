import React from "react";
const NumberView = (props) => {
    // const dotNotation = (data) =>{
    //     if(Array.isArray(data)){
    //         return <span className="digits"><span className="start">{data[0]}</span><span className="end">{data[1]}</span></span>;
    //     }
    //     else {
    //         return <span className="digits">{data}</span>;
    //     }
    // };
    return (
        Array.isArray(props.data) ?
            <span className="digits"><span className="start">{props.data[0]}</span><span className="end">{props.data[1]} </span></span>
            :  <span className="digits"><span className="start">{props.data}</span></span>
        
    );
};
export default NumberView;