import React, {useEffect, useState} from "react";
import {Table, Modal, Dropdown, Tab, Nav,} from "react-bootstrap";
import {getDelegationsUrl, getValidatorsUrl, getValidatorUrl} from "../../../constants/url";
import helper from "../../../utils/helper"
import axios from "axios";
import Avatar from "./Avatar";
import Loader from "../../../components/Loader";
import Lodash from 'lodash';
import Icon from "../../../components/Icon";
import ModalActions from "./ModalActions";

const ValidatorsTable = (props) => {
    const [modalDelegate, setModalOpen] = useState();
    const [validator, setValidator] = useState('');
    const handleModal = (name, validator) => {
        setModalOpen(name);
        setValidator(validator);
    };
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
                {props.validatorsList.length ?
                    props.validatorsList.map((validator, index) => {
                        let commissionRate = validator.commission.commission_rates.rate * 100;
                        commissionRate = parseFloat(commissionRate.toFixed(2)).toLocaleString();
                        const active = helper.isActive(validator);
                        let votingPower = validator.tokens * Math.pow(10, -6);
                        let votingPowerPercentage = active
                            ? validator.tokens * 100 / props.activeValidatorsTokens
                            : validator.tokens * 100 / props.inActiveValidatorsTokens;
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
                    :<tr><td colSpan={5} className="text-center"> No Validators Found</td></tr>
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

export default ValidatorsTable;
