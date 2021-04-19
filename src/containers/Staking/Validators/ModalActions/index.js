import {
    Modal,
} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';
import Avatar from "../Avatar";
import helper from "../../../../utils/helper";
import ModalReDelegate from "../ModalReDelegate";
import ModalUnbond from "../ModalUnbond";
import ModalWithdraw from "../ModalWithdraw";
import ModalDelegate from "../ModalDelegate";
import {getDelegationsUrl, getValidatorRewardsUrl} from "../../../../constants/url";
import axios from "axios";
import {useTranslation} from "react-i18next";
import ModalSetWithdrawAddress from "../../../Wallet/ModalSetWithdrawAddress";
import {connect} from "react-redux";

const ModalActions = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [txModalShow, setTxModalShow] = useState(false);
    const [initialModal, setInitialModal] = useState(true);
    const [address, setAddress] = useState('');
    const [delegationAmount, setDelegationAmount] = useState(0);
    const [moniker, setMoniker] = useState('');
    const [modalDelegate, setModalOpen] = useState();
    const [rewards, setRewards] = useState(0);
    const [delegateStatus, setDelegateStatus] = useState(false);
    const [withdraw, setWithDraw] = useState(false);
    useEffect(() => {
        let address = localStorage.getItem('address');
        const fetchValidatorRewards = async () => {
            const url = getValidatorRewardsUrl(address, props.validator.operator_address);
            axios.get(url).then(response => {
                if (response.data.rewards[0].amount) {
                    setRewards((response.data.rewards[0].amount / 1000000).toFixed(6))
                }
            }).catch(error => {
                console.log(error.response
                    ? error.response.data.message
                    : error.message)
            });
            const delegationsUrl = getDelegationsUrl(address);
            axios.get(delegationsUrl).then(response => {
                let delegationResponseList = response.data.delegation_responses;
                for (const item of delegationResponseList) {
                    if (item.delegation.validator_address === props.validator.operator_address) {
                        setDelegationAmount(item.balance.amount / 1000000);
                        setDelegateStatus(true);
                    }
                }
            }).catch(error => {
                console.log(error.response
                    ? error.response.data.message
                    : error.message)
            });
        };
        fetchValidatorRewards();
    }, []);

    const handleClose = () => {
        setShow(false);
        props.setModalOpen('');
    };
    const handleModal = (name, address, validatorMoniker) => {
        setShow(false);
        setInitialModal(false);
        setTxModalShow(true);
        setModalOpen(name);
        setMoniker(validatorMoniker);
        setAddress(address);
    };

    let commissionRate = props.validator.commission.commission_rates.rate * 100;
    commissionRate = parseFloat(commissionRate.toFixed(2)).toLocaleString();
    let active = helper.isActive(props.validator);

    const handleRewards = () => {
            setInitialModal(false);
            setShow(false);
            setTxModalShow(false);
            setWithDraw(true);

    };

    return (

        <>
            {initialModal ?
                <Modal
                    animation={false}
                    centered={true}
                    show={show}
                    className="actions-modal"
                    onHide={handleClose}>

                    <>
                        <Modal.Body className="actions-modal-body">
                            <div className="moniker-box">
                                <Avatar
                                    identity={props.validator.description.identity}/>
                                <div className="info">
                                    <p className="name">{props.validator.description.moniker}</p>
                                    <p className="commission"> {t("COMMISSION")} - {commissionRate}%</p>
                                </div>
                            </div>
                            {
                                props.validator.description.website !== "" ?
                                    <div className="website">
                                        <p className="name">{t("WEBSITE")}</p>
                                        <p className="value"><a href={props.validator.description.website}
                                                                rel="noopener noreferrer"
                                                                target="_blank">{props.validator.description.website}</a>
                                        </p>
                                    </div>
                                    : null
                            }
                            {
                                props.validator.description.details !== "" ?
                                    <div className="description">
                                        <p className="name">{t("DESCRIPTION")}</p>
                                        <p className="value">{props.validator.description.details}</p>
                                    </div>
                                    : null
                            }
                            <div className="buttons-group">

                                {active ?
                                    <button
                                        onClick={() => handleModal('Delegate', props.validator.operator_address, props.validator.description.moniker)}
                                        className="button button-primary">
                                        {t("DELEGATE")}
                                    </button>
                                    :
                                    null
                                }
                                    <button className="button button-primary"
                                            onClick={() => handleModal('Redelegate', props.validator.operator_address, props.validator.description.moniker)}
                                    >{t("REDELEGATE")}
                                    </button>
                                    <button
                                        onClick={() => handleModal('Unbond', props.validator.operator_address, props.validator.description.moniker)}
                                        className="button button-primary">
                                        {t("UNBOND")}
                                    </button>
                                    <button
                                        onClick={() => handleModal('Withdraw', props.validator.operator_address, props.validator.description.moniker)}
                                        className="button button-primary">
                                        {t("CLAIM_REWARDS")}
                                    </button>

                            </div>

                        </Modal.Body>
                    </>
                </Modal>
                :
                <Modal
                    animation={false}
                    centered={true}
                    backdrop="static"
                    show={txModalShow}
                    className="modal-custom delegate-modal"
                    onHide={handleClose}>
                    {
                        modalDelegate === 'Delegate' ?
                            <ModalDelegate
                                setTxModalShow={setTxModalShow}
                                setInitialModal={setInitialModal}
                                setShow={setShow}
                                setModalOpen={setModalOpen}
                                validatorAddress={address}
                                moniker={moniker}
                                open={true}
                                handleClose={handleClose}
                            />
                            : null
                    }
                    {
                        modalDelegate === 'Redelegate' ?
                            <ModalReDelegate
                                setTxModalShow={setTxModalShow}
                                setInitialModal={setInitialModal}
                                setShow={setShow}
                                setModalOpen={setModalOpen}
                                validatorAddress={address}
                                moniker={moniker}
                                delegateStatus={delegateStatus}
                                handleClose={handleClose}
                                delegationAmount={delegationAmount}
                            />
                            : null
                    }
                    {
                        modalDelegate === 'Unbond' ?
                            <ModalUnbond
                                setTxModalShow={setTxModalShow}
                                setInitialModal={setInitialModal}
                                setShow={setShow}
                                setModalOpen={setModalOpen}
                                validatorAddress={address}
                                moniker={moniker}
                                delegateStatus={delegateStatus}
                                handleClose={handleClose}
                                delegationAmount={delegationAmount}
                            />
                            : null
                    }
                    {
                        modalDelegate === 'Withdraw' ?
                            <ModalWithdraw
                                setTxModalShow={setTxModalShow}
                                setInitialModal={setInitialModal}
                                setShow={setShow}
                                setModalOpen={setModalOpen}
                                validatorAddress={address}
                                moniker={moniker}
                                rewards={rewards}
                                handleClose={handleClose}
                                handleRewards={handleRewards}
                            />
                            : null
                    }
                </Modal>
            }
            {withdraw ?
                <ModalSetWithdrawAddress setWithDraw={setWithDraw} handleClose={handleClose}
                                         totalRewards={props.rewards} />
                : null
            }

        </>
    );
};


const stateToProps = (state) => {
    return {
        rewards: state.rewards.rewards,
    };
};
export default connect(stateToProps)(ModalActions);

