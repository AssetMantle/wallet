import React, {useState} from "react";
import {
    Form, Modal,
} from "react-bootstrap";
import Icon from "../../components/Icon";
import {useHistory} from "react-router-dom";
import config from "../../config";
import helper from "../../utils/helper";
import {useTranslation} from "react-i18next";
import transactions, {GetAccount} from "../../utils/transactions";
const AddressImport = (props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState("");
    const [show, setShow] = useState(true);
    const handleSubmit = async event => {
        event.preventDefault();
        setErrorMessage("");
        const address = event.target.address.value;
        if (helper.validateAddress(address)) {
            GetAccount(address)
                .then(res => {
                    if(transactions.VestingAccountCheck(res.typeUrl)){
                        localStorage.setItem('fee', config.vestingAccountFee);
                        localStorage.setItem('account', 'vesting');
                    }else {
                        localStorage.setItem('fee', config.defaultFee);
                        localStorage.setItem('account', 'non-vesting');
                    }
                    console.log("done", res);
                })
                .catch(error => {
                    console.log(error.message);
                    localStorage.setItem('fee', config.defaultFee);
                    localStorage.setItem('account', 'non-vesting');
                });
            localStorage.setItem('loginToken', 'loggedIn');
            localStorage.setItem('address', address);
            localStorage.setItem('loginMode', 'normal');
            localStorage.setItem('version', config.version);
            history.push('/dashboard/wallet');
            setShow(false);
        } else {
            setErrorMessage("Enter Valid Address");
        }
    };
    const handleClose = () => {
        setShow(false);
        props.handleClose();
    };
    const handlePrevious = (formName) => {
        if (formName === "addressImport") {
            setShow(false);
            props.setShow(true);
            props.setWithAddress(false);
        }
    };
    return (
        <Modal backdrop="static" show={show} onHide={handleClose} centered className="create-wallet-modal seed">
            <Modal.Header closeButton>
                <div className="previous-section">
                    <button className="button" onClick={() => handlePrevious("addressImport")}>
                        <Icon
                            viewClass="arrow-right"
                            icon="left-arrow"/>
                    </button>
                </div>
                <h3 className="heading">{t("SIGN_IN")}</h3>
            </Modal.Header>
            <div className="create-wallet-body create-wallet-form-body">
                <Form onSubmit={handleSubmit} className="form-privatekey">
                    <div className="form-field">
                        <p className="label">{t("ADDRESS")}</p>
                        <Form.Control
                            type="text"
                            name="address"
                            onKeyPress={helper.inputSpaceValidation}
                            id="addressImport"
                            placeholder={t("ENTER_ADDRESS")}
                            required={true}
                        />
                    </div>
                    {errorMessage !== ''
                        ? <p className="form-error">{errorMessage}</p>
                        : null

                    }
                    <div className="buttons">
                        <button className="button button-primary">{t("SUBMIT")}</button>
                    </div>
                </Form>

            </div>
        </Modal>
    );
};
export default AddressImport;
