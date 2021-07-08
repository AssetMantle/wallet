import React, {useState} from "react";
import helper from "../../../utils/helper";
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
        name: '',
        label: '',
        options: {sort: false}
    },{
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
            (validator.delegations > 0) ? <div className="delegation-rank active">{index+1}</div>: <div className="delegation-rank inactive">{index+1}</div>,
            <div key={index} className="validator-name">
                <Avatar
                    identity={validator.data.description.identity}/>
                {validator.data.description.moniker}
            </div>,
            <div className="voting" key={index}>
                {parseFloat((validator.data.tokens * Math.pow(10, -6)).toFixed(2))}
                {
                    helper.isActive(validator.data)
                        ? `(${parseFloat((validator.data.tokens * 100 / props.activeValidatorsTokens).toString()).toFixed(2).toLocaleString()}%)`
                        : `(${parseFloat((validator.data.tokens * 100 / props.inActiveValidatorsTokens).toString()).toFixed(2).toLocaleString()}%)`
                }
            </div>
            ,
            <span className="voting" key={index}>{`${parseFloat((helper.decimalConversion(validator.data.commission.commissionRates.rate) * 100).toFixed(2))}`} %</span>,
            <div className="" key={index}>
                {helper.isActive(validator.data) ?
                    <span className="icon-box" title="active">
                        <img src={activeIcon} alt="activeIcon"/>
                    </span>
                    :
                    <span className="icon-box" title="Inactive">
                        <img src={inActiveIcon} alt="inActiveIcon"/>
                    </span>
                }
            </div>,
            <div className="actions-td" key={index}>
                <button
                    onClick={() => handleModal('ModalActions', validator.data)}
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
        viewColumns:false,
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
