import React, {useEffect, useState} from "react";
import {Table, Modal, Dropdown, Tab, Nav,} from "react-bootstrap";
import {getDelegationsUrl, getValidatorsUrl, getValidatorUrl} from "../../../constants/url";
import helper from "../../../utils/helper"
import axios from "axios";
import Avatar from "./Avatar";
import activeIcon from "../../../assets/images/active.svg";
import inActiveIcon from "../../../assets/images/inactive.svg";
import Icon from "../../../components/Icon";
import ModalActions from "./ModalActions";
import DataTable from "../../../components/DataTable";

const ValidatorsTable = (props) => {
    const [modalDelegate, setModalOpen] = useState();
    const [validator, setValidator] = useState('');
    const handleModal = (name, validator) => {
        setModalOpen(name);
        setValidator(validator);
    };
    const columns = [{
        name: 'validator',
        label: 'Validator',
        options: {sort: false}
    }, {
        name: 'votingPower',
        label: 'Voting Power',
    }, {
        name: 'commission',
        label: 'Commission',

    }, {
        name: 'status',
        label: 'Status',
        options: {sort: false}
    }, {
        name: 'actions',
        label: 'Actions',
        options: {sort: false}
    }];
    const options = {
        responsive: "standard",
        filters: false,
        pagination: false,
        selectableRows: false,
        print: false,
        download: false,
        filter:false
    };
    const tableData = props.validatorsList.length ?
        props.validatorsList.map((validator, index) => [
            <div>
                <Avatar
                    identity={validator.description.identity}/>
                {validator.description.moniker}
            </div>,
            <div>
                {parseFloat((validator.tokens * Math.pow(10, -6)).toFixed(2)).toLocaleString()}
                {
                    helper.isActive(validator)
                        ? `(${parseFloat((validator.tokens * 100 / props.activeValidatorsTokens)).toFixed(2).toLocaleString()}%)`
                        : `(${parseFloat((validator.tokens * 100 / props.inActiveValidatorsTokens)).toFixed(2).toLocaleString()}%)`
                }
            </div>
            ,
            <span>{`${parseFloat((validator.commission.commission_rates.rate * 100).toFixed(2)).toLocaleString()}%`}</span>,
            <div className="">
                {helper.isActive(validator) ?
                    <span className="icon-box" title="active">
                                            <img src={activeIcon} alt="activeIcon"/>
                                        </span>
                    :
                    <span className="icon-box" title="Inactive">
                                         <img src={inActiveIcon} alt="inActiveIcon"/>
                                        </span>
                }
            </div>,
            <div className="actions-td">
                <button
                    onClick={() => handleModal('ModalActions', validator)}
                    className="button button-primary">
                    Actions
                </button>
            </div>
        ])
        : [];
    return (
        <div className="txns-container">
            <DataTable
                columns={columns}
                data={tableData}
                name=""
                options={options}/>
            {
                modalDelegate === 'ModalActions' ?
                    <ModalActions setModalOpen={setModalOpen} validator={validator}/>
                    : null
            }

        </div>
    );
};

export default ValidatorsTable;
