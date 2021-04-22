import React from 'react';
import loaderImage from "../../assets/images/loader.svg";
const Loader = () => {
    return (
        <img src={loaderImage} alt="loader" className="loader"/>
    );
};

export default React.memo(Loader);
