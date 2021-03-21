import React, {useEffect, useState} from "react";
import {Table, Modal, Dropdown} from "react-bootstrap";
import {getDelegationsUrl, getValidatorsUrl, getValidatorUrl} from "../../../constants/url";
import helper from "../../../utils/helper"
import axios from "axios";
import Avatar from "./Avatar";
import Loader from "../../../components/Loader";
import Lodash from 'lodash';
import Icon from "../../../components/Icon";
import ModalActions from "./ModalActions";

const Validators = (props) => {
    const [modalDelegate, setModalOpen] = useState();
    const [loading, setLoading] = useState(true);
    const [validator, setValidator] = useState('');
    const [activeValidators, setActiveValidators] = useState(0);
    const [inActiveValidators, setInActiveValidators] = useState(0);
    const [validatorsList, setValidatorsList] = useState([]);
    const handleModal = (name, validator) => {
        setModalOpen(name);
        setValidator(validator);
    };
    useEffect(() => {

        const fetchValidators = async () => {
            const address = localStorage.getItem('address');
            console.log(address, "loggedIn address");
            const validatorUrl = getValidatorsUrl();
            const validatorResponse = await axios.get(validatorUrl);
            let validators = validatorResponse.data.validators;
            const active = Lodash.sumBy(validators, (item) => {
                return helper.isActive(item) ? item.tokens : 0;
            });
            setActiveValidators(active);
            const inactive = Lodash.sumBy(validators, (item) => {
                return helper.isActive(item) ? 0 : item.tokens;
            });
            setInActiveValidators(inactive);
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
                        const active = helper.isActive(validator);
                        let votingPower = validator.tokens * Math.pow(10, -6);
                        let votingPowerPercentage = active
                            ? validator.tokens * 100 / activeValidators
                            : validator.tokens * 100 / inActiveValidators;
                        votingPower = parseFloat(votingPower.toFixed(2)).toLocaleString();
                        votingPowerPercentage = parseFloat(votingPowerPercentage.toFixed(2)).toLocaleString();
                        return (
                            <tr key={index}>
                                <td className=""><Avatar
                                    identity={validator.description.identity}/> {validator.description.moniker}</td>
                                <td className="">{`${votingPower} (${votingPowerPercentage}%)`}</td>
                                <td className="">{commissionRate} %</td>
                                <td className="">
                                    {active ?
                                        <span className="icon-box success" title="active">
                                        <Icon
                                            viewClass="arrow-right"
                                            icon="success"/>
                                        </span>
                                        :
                                        <span className="icon-box error" title="Inactive">
                                        <Icon
                                            viewClass="arrow-right"
                                            icon="pending"/>
                                        </span>
                                    }
                                </td>
                                <td className="actions-td">
                                    <button
                                        onClick={() => handleModal('ModalActions', validator)}
                                        className="button button-primary">
                                        Actions
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
            {
                modalDelegate === 'ModalActions' ?
                    <ModalActions setModalOpen={setModalOpen} validator={validator}/>
                    : null
            }

        </div>
    );
};

export default Validators;
