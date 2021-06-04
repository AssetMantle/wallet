import {
    Modal, Table,
} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';
import {connect} from "react-redux";
import {useTranslation} from "react-i18next";
import Icon from "../../../components/Icon";
import transactions from "../../../utils/transactions";
import ActionHelper from "../../../utils/actions";

const ModalViewValidatorRewards = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [dataList, setDataList] = useState([]);
    const loginAddress = localStorage.getItem('address');

    const handleClose = () => {
        setShow(false);
        props.handleClose();
        props.setShowRewardsModal(false);
    };
    useEffect(()=>{
        const fetchRewardsList = async ()=>{
            let list =[];
            for (const item of props.validatorsList) {
                if(transactions.checkValidatorAccountAddress(item.value, loginAddress)){
                    let commissionInfo = await ActionHelper.getValidatorCommission(item.value);
                    const data = {
                        label: item.label,
                        rewards:item.rewards,
                        commission: commissionInfo
                    };
                    list.push(data);
                }
                else {
                    const data = {
                        label: item.label,
                        rewards:item.rewards,
                    };
                    list.push(data);
                }
            }
            setDataList(list);
        };
        fetchRewardsList();
    },[]);
    const handlePrevious = () => {
        if(props.formName === "viewRewards"){
            props.setShow(true);
            props.setShowRewardsModal(false);
            setShow(false);
        }
    };

    return (
        <Modal
            animation={false}
            centered={true}
            keyboard={false}
            backdrop="static"
            show={show}
            className="modal-custom claim-rewards-modal"
            onHide={handleClose}>
            <>
                <Modal.Header className="result-header success" closeButton>
                    <div className="previous-section txn-header">
                        <button className="button" onClick={() => handlePrevious()}>
                            <Icon
                                viewClass="arrow-right"
                                icon="left-arrow"/>
                        </button>
                    </div>
                    <h3 className="heading">
                        {t("REWARDS")}
                    </h3>
                </Modal.Header>
                <Modal.Body className="delegate-modal-body">

                    <Table borderless>
                        <thead>
                            <tr>
                                <th>Moniker</th>
                                <th>Rewards</th>
                                <th>Validator Commission</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataList.map((validator, index) => (
                                    <tr key={index}>
                                        <td>{validator.label}</td>
                                        <td>{validator.rewards}</td>
                                        {validator.commission?
                                            <td>{validator.commission} </td>:
                                            <td>--</td>
                                        }
                                    </tr>
                                ))
                            }

                        </tbody>
                    </Table>

                </Modal.Body>
            </>
        </Modal>
    );
};

const stateToProps = (state) => {
    return {
        validatorsList: state.validators.validatorsRewardsList,
    };
};

export default connect(stateToProps)(ModalViewValidatorRewards);
