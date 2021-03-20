import {Form, Modal as ReactModal} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';
import success from "../../../assets/images/success.svg";
import icon from "../../../assets/images/icon.svg";
import {getDelegationsUrl, getValidatorUrl} from "../../../constants/url";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from "axios";
const ModalWithdraw = (props) => {
    const [show, setShow] = useState(true);
    const [validatorAddress, setValidatorAddress] = useState('');
    const [response, setResponse] = useState(false);
    const [validatorsList, setValidatorsList] = useState([]);

    useEffect(() => {
        const fetchValidators = async () => {
            const delegationsUrl = getDelegationsUrl('persistence1095fgex3h37zl4yjptnsd7qfmspesvav7xhgwt');
            const delegationResponse = await axios.get(delegationsUrl);
            let delegationResponseList = delegationResponse.data.delegation_responses;
            let validators = [];
            for (const item of delegationResponseList) {
                const validatorUrl = getValidatorUrl(item.delegation.validator_address);
                const validatorResponse = await axios.get(validatorUrl);
                validators.push(validatorResponse.data.validator);
            }
            setValidatorsList(validators);
            console.log(validators, "validator_address");
        };
        fetchValidators();
    },[]);
    const handleClose = (amount) =>{
        setShow(false)
        props.setRewards(false)
    }

    const handleSubmit = async event => {
        event.preventDefault();
        const password = event.target.password.value;
        const mnemonic = event.target.mnemonic.value;
        console.log(password, mnemonic, validatorAddress, "withdraw form value") //validatorAddress taking stake.
    };
    const onChangeSelect = (evt) =>{
        setValidatorAddress(evt.target.value)
        console.log(evt.target.value, "rakji")
    }
    return (
        <ReactModal
            animation={false}
            centered={true}
            keyboard={false}
            show={show}
            className="modal-custom claim-rewards-modal"
            onHide={handleClose}>
            {!response ?
                <>
                    <ReactModal.Header>
                        Claiming Rewards
                    </ReactModal.Header>
                    <ReactModal.Body className="rewards-modal-body">
                        <Form onSubmit={handleSubmit}>
                            <div className="form-field">
                                <p className="label">Select Validator</p>

                                <Select value={validatorAddress} className="validators-list-selection" onChange={onChangeSelect} displayEmpty>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        validatorsList.map((validator, index) => (
                                            <MenuItem
                                                key={index + 1}
                                                className=""
                                                value={validator.operator_address}>
                                                {validator.description.moniker}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </div>
                            <div className="form-field">
                                <p className="label">Total Available</p>
                                <div className="available-tokens">
                                    <img src={icon} alt="icon"/>
                                    <p className="tokens">4.534 <span>XPRT</span></p>
                                    <p className="usd">=$194.04</p>
                                </div>
                            </div>
                            <div className="form-field">
                                <p className="label">Memo</p>
                                <Form.Control as="textarea" rows={3} name="mnemonic"
                                              placeholder="Enter Seed"
                                              required={true}/>
                            </div>
                            <div className="form-field">
                                <p className="label">Password</p>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter Your Wallet Password"
                                    required={true}
                                />
                            </div>
                            <div className="buttons">
                                <button className="button button-primary">Withdraw</button>
                            </div>
                        </Form>
                    </ReactModal.Body>
                </>
                : null
            }
            {
                response ?
                    <>
                        <ReactModal.Header className="result-header success">
                            Succesfully Delegated!
                        </ReactModal.Header>
                        <ReactModal.Body className="delegate-modal-body">
                            <div className="result-container">
                                <img src={success} alt="success-image"/>
                                <p className="tx-hash">Tx Hash: CAC4BA3C67482F09B46E129A00A86846567941555685673599559EBB5899DB3C</p>
                                <div className="buttons">
                                    <button className="button" >Done</button>
                                </div>
                            </div>
                        </ReactModal.Body>
                    </>
                    : null
            }
        </ReactModal>
    );
};


export default ModalWithdraw;
