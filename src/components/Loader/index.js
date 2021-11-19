import React from 'react';
import loaderImage from "../../assets/images/loader.svg";
import {Modal} from "react-bootstrap";

const Loader = () => {
    return (
        <Modal
            show={true}
            backdrop="static"
            keyboard={false}
            centered
            className="loader"
        >
            <img src={loaderImage} alt="loader"/>
        </Modal>
    );
};

export default React.memo(Loader);
