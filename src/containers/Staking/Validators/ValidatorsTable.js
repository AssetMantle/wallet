import React, {useState} from "react";
import helper from "../../../utils/helper"
import Avatar from "./Avatar";
import activeIcon from "../../../assets/images/active.svg";
import inActiveIcon from "../../../assets/images/inactive.svg";
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
        options: {
            sortCompare: (order) => {
                return (obj1, obj2) => {
                    let val1 = obj1.data.props.children[1];
                    let val2 = obj2.data.props.children[1];
                    return (val1.length - val2.length) * (order === 'asc' ? 1 : -1);
                };
            }

        }
    }, {
        name: 'votingPower',
        label: 'Voting Power',
        options: {
            sortCompare: (order) => {
                return (obj1, obj2) => {
                    let val1 = parseInt(obj1.data.props.children[0]);
                    let val2 = parseInt(obj2.data.props.children[0]);
                    return (val1 - val2) * (order === 'asc' ? 1 : -1);
                };
            }
        }
    }, {
        name: 'commission',
        label: 'Commission',
        options: {
            sortCompare: (order) => {
                return (obj1, obj2) => {
                    let val1 = parseInt(obj1.data.props.children[0]);
                    let val2 = parseInt(obj2.data.props.children[0]);
                    return (val1 - val2) * (order === 'asc' ? 1 : -1);
                };
            }
        }
    }, {
        name: 'status',
        label: 'Status',
        options: {sort: false}
    }, {
        name: 'actions',
        label: 'Actions',
        options: {sort: false}
    }];

    const tableData = props.validatorsList.length ?
        props.validatorsList.map((validator, index) => [
            <div>
                <Avatar
                    identity={validator.description.identity}/>
                {validator.description.moniker}
            </div>,
            <div>
                {parseFloat((validator.tokens * Math.pow(10, -6)).toFixed(2))}
                {
                    helper.isActive(validator)
                        ? `(${parseFloat((validator.tokens * 100 / props.activeValidatorsTokens)).toFixed(2).toLocaleString()}%)`
                        : `(${parseFloat((validator.tokens * 100 / props.inActiveValidatorsTokens)).toFixed(2).toLocaleString()}%)`
                }
            </div>
            ,
            <span>{`${parseFloat((validator.commission.commission_rates.rate * 100).toFixed(2))}`} %</span>,
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

    const options = {
        responsive: "standard",
        filters: false,
        pagination: false,
        selectableRows: false,
        print: false,
        download: false,
        filter: false,
        search: false,
    };

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
