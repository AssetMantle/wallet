import React from 'react';
import {Form} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {setTxKeyStore} from "../../../actions/transactions/keyStore";

const FileInput = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const onChange = (event) => {
        const file = event.target.files[0];
        console.log(file, "files");
        dispatch(setTxKeyStore(
            {value:file,
                error: new Error('')}));
    };
    return (
        <div className="form-field upload">
            <p className="label">  {t("KEY_STORE_FILE")}</p>
            <Form.File name="uploadFileS" onChange={onChange}
                className="file-upload" accept=".json" required={true}/>
        </div>
    );
};



export default FileInput;
