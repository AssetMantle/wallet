import React, {useEffect, useState} from "react";
import {Table, Modal, Dropdown} from "react-bootstrap";
import ModalDelegate from "./ModalDelegate";
import IconMore from "../../../assets/images/more.svg";
import ModalReDelegate from "./ModalReDelegate";
import ModalUnbond from "./ModalUnbond";
import ModalWithdraw from "./ModalWithdraw";
import {getDelegationsUrl, getValidatorUrl} from "../../../constants/url";
import axios from "axios";
import Avatar from "./Avatar";
import Loader from "../../../components/Loader";
const Validators = (props) => {
    const [modalDelegate, setModalOpen] = useState();
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('');
    const [moniker, setMoniker] = useState('');
    const [validatorsList, setValidatorsList] = useState([]);
    const handleModal = (name, address, validator) => {
        setModalOpen(name);
        setMoniker(validator);
        setAddress(address);
    };
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
            console.log(validators, "validators")
            setValidatorsList(validators);
            setLoading(false);
        };
        fetchValidators();
    }, []);
    if (loading) {
        return <Loader/>;
    }
    return (
        <div className="txns-container">
            <Table responsive borderless>
                <thead>
                <tr>
                    <th>Validator</th>
                    <th>Voting Power</th>
                    <th>Commission</th>
                    <th>Status</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {
                    validatorsList.map((validator, index) => {
                        let commissionRate = validator.commission.commission_rates.rate * 100;
                        commissionRate = parseFloat(commissionRate.toFixed(2)).toLocaleString();
                        return (
                            <tr>
                                <td className=""><Avatar
                                    identity={validator.description.identity}/> {validator.description.moniker}</td>
                                <td className="">4,250,000 (4.25%)</td>
                                <td className="">{commissionRate} %</td>
                                <td className="">{validator.status}</td>
                                <td className="actions-td">
                                    <button type="button" className="button button-primary"
                                            onClick={() => handleModal('Delegate', validator.operator_address, validator.description.moniker)}>Delegate a Validator
                                    </button>
                                    <Dropdown className="more-dropdown">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            <img src={IconMore} alt="IconMore"/>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                onClick={() => handleModal('Redelegate', validator.operator_address, validator.description.moniker)}>Redelegate</Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => handleModal('Unbond', validator.operator_address, validator.description.moniker)}>Unbond</Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() => handleModal('Withdraw', validator.operator_address, validator.description.moniker)}>Claim
                                                Rewards</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
            {
                modalDelegate === 'Delegate' ?
                    <ModalDelegate setModalOpen={setModalOpen} validatorAddress={address} moniker={moniker}/>
                    : null
            }
            {
                modalDelegate === 'Redelegate' ?
                    <ModalReDelegate setModalOpen={setModalOpen} validatorAddress={address} moniker={moniker}/>
                    : null
            }
            {
                modalDelegate === 'Unbond' ?
                    <ModalUnbond setModalOpen={setModalOpen} validatorAddress={address} moniker={moniker}/>
                    : null
            }
            {
                modalDelegate === 'Withdraw' ?
                    <ModalWithdraw setModalOpen={setModalOpen} validatorAddress={address} moniker={moniker}/>
                    : null
            }
        </div>
    );
};

export default Validators;
