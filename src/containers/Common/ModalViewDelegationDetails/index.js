import {Modal, Table} from 'react-bootstrap';
import React, {useState} from 'react';
import {connect} from "react-redux";
import transactions from "../../../utils/transactions";
import {useTranslation} from "react-i18next";
import helper from "../../../utils/helper";
import NumberView from "../../../components/NumberView";

const ModalViewDelegationDetails = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    const handleModal = () => {
        setShow(true);
    };
    let addressTruncate;

    return (
        <>
            <Modal
                animation={false}
                centered={true}
                show={show}
                backdrop="static"
                size="lg"
                className="modal-custom list-modal delegate-list-modal"
                onHide={handleClose}>
                <Modal.Header className="result-header" closeButton>
                    <h3 className="heading">
                        {t("VIEW_DELEGATIONS")}
                    </h3>
                </Modal.Header>
                <Modal.Body className="list-modal-body">
                    <ul className="modal-list-data">
                        <Table borderless hover responsive>
                            <thead>
                                <tr>
                                    <th>{t("MONIKER")}</th>
                                    <th>{t("VALIDATOR_ADDRESS")}</th>
                                    <th>{t("AMOUNT")}</th>
                                    <th>{t("STATUS")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.validatorsList ?
                                    props.validatorsList.map((delegation, index) => {
                                        addressTruncate = helper.stringTruncate(delegation.data.operatorAddress);
                                        return (
                                            <tr key={index}>
                                                <td>{delegation.data.description.moniker}
                                                </td>
                                                <td><span title={delegation.data.operatorAddress}>{addressTruncate}</span></td>
                                                <td><span className="amount">
                                                    <NumberView data={helper.digitFormat(transactions.XprtConversion(delegation.delegations*1))}/> XPRT
                                                </span></td>
                                                <td>     {helper.isActive(delegation.data) ?
                                                    <span className="active-icon-box" title="active">
                                                            active
                                                    </span>
                                                    :
                                                    <span className="inactive-icon-box" title="Inactive">
                                                            Inactive
                                                    </span>
                                                }</td>
                                            </tr>
                                        );

                                    }) : null
                                }
                            </tbody>
                        </Table>

                    </ul>
                </Modal.Body>
            </Modal>
            <span className="view-button" onClick={handleModal} title="View Unbonding XPRT Schedule">{t("VIEW")}</span>
        </>

    );
};


const stateToProps = (state) => {
    return {
        validatorsList: state.validators.delegatedValidators,
    };
};


export default connect(stateToProps)(ModalViewDelegationDetails);

