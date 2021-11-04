import React, {useState} from "react";
import helper from "../../../../utils/helper";
import Avatar from "../Avatar";
import activeIcon from "../../../../assets/images/active.svg";
import inActiveIcon from "../../../../assets/images/inactive.svg";
import ModalActions from "../ModalActions";
import DataTable from "../../../../components/DataTable";
import {fetchValidators} from "../../../../actions/validators";
import {connect} from "react-redux";
import transactions from "../../../../utils/transactions";
import {useTranslation} from "react-i18next";

const DelegatedValidators = (props) => {
    const {t} = useTranslation();
    const [modalDelegate, setModalOpen] = useState();
    const [validator, setValidator] = useState('');
    const handleModal = (name, validator) => {
        setModalOpen(name);
        setValidator(validator);
    };
    const columns = [{
        name: 'validator',
        label: t("VALIDATOR"),
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
        name: 'delegatedAmount',
        label: `${t("DELEGATED_AMOUNT")}(XPRT)`,
        options: {
            sortCompare: (order) => {
                return (obj1, obj2) => {
                    let val1 = parseInt(obj1.data.props.children);
                    let val2 = parseInt(obj2.data.props.children);
                    return (val1 - val2) * (order === 'asc' ? 1 : -1);
                };
            }
        }
    }, {
        name: 'status',
        label: t("STATUS"),
        options: {sort: false}
    }, {
        name: 'actions',
        label: t("ACTIONS"),
        options: {sort: false}
    }];
    const tableData = props.validatorsList.length ?
        props.validatorsList.map((validator, index) => [
            <div key={index} className="validator-name">
                <Avatar
                    identity={validator.data.description.identity}/>
                {validator.data.description.moniker}
            </div>,
            <div className="voting" key={index}>
                {transactions.XprtConversion(validator.delegations)}
            </div>
            ,
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
        selectableRows: 'none',
        print: false,
        download: false,
        filter: false,
        viewColumns: false,
        search: false,
    };

    return (
        <div className="txns-container delegated-validators">
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


const stateToProps = (state) => {
    return {
        validatorsList: state.validators.delegatedValidators,
        inActiveList: state.validators.inActiveList,
        activeVotingPower: state.validators.activeVotingPower,
        inActiveVotingPower: state.validators.inActiveVotingPower,
        inProgress: state.validators.inProgress,
    };
};

const actionsToProps = {
    fetchValidators,
};

export default connect(stateToProps, actionsToProps)(DelegatedValidators);
