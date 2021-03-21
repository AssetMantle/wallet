import {
    Accordion,
    AccordionContext,
    Card, Dropdown,
    Form,
    Button,
    Modal,
    ButtonGroup,
    useAccordionToggle
} from 'react-bootstrap';
import React, {useState, useEffect, useContext} from 'react';
import Avatar from "../Avatar";
import Icon from "../../../../components/Icon";
import helper from "../../../../utils/helper";
import ModalReDelegate from "../ModalReDelegate";
import ModalUnbond from "../ModalUnbond";
import ModalWithdraw from "../ModalWithdraw";
import ModalDelegate from "../ModalDelegate";

const ModalActions = (props) => {
    const [amount, setAmount] = useState(0);
    const [show, setShow] = useState(true);
    const [txModalShow, setTxModalShow] = useState(false);
    const [response, setResponse] = useState('');
    const [initialModal, setInitialModal] = useState(true);
    const [address, setAddress] = useState('');
    const [moniker, setMoniker] = useState('');
    const [modalDelegate, setModalOpen] = useState();
    const handleAmount = (amount) => {
        setAmount(amount)
    };

    const handleAmountChange = (evt) => {
        setAmount(evt.target.value)
    };
    const handleClose = () => {
        setShow(false);

        props.setModalOpen('');
        setResponse('');
    };
    const handleModal = (name, address, validatorMoniker) => {
        setShow(false);
        setInitialModal(false)
        setTxModalShow(true)
        setModalOpen(name);
        setMoniker(validatorMoniker);
        setAddress(address);
    };

    let commissionRate = props.validator.commission.commission_rates.rate * 100;
    commissionRate = parseFloat(commissionRate.toFixed(2)).toLocaleString();
    let active = helper.isActive(props.validator);
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
                                      <p className="commission">Commission - {commissionRate}%</p>
                                  </div>
                            </div>
                                {
                                    props.validator.description.website !== "" ?
                                        <div className="website">
                                            <p className="name">website</p>
                                            <p className="value"><a href={`http://${props.validator.description.website}`} target="_blank">{props.validator.description.website}</a> </p>
                                        </div>
                                        : null
                                }
                                {
                                    props.validator.description.details !== "" ?
                                        <div className="description">
                                            <p className="name">Description</p>
                                            <p className="value">{props.validator.description.details}</p>
                                        </div>
                                        : null
                                }
                            <div className="buttons-group">

                                {active ?
                                    <button
                                        onClick={() => handleModal('Delegate', props.validator.operator_address, props.validator.description.moniker)} className="button button-primary">
                                        Delegate
                                    </button>
                                    :
                                    null
                                }
                                <Dropdown as={ButtonGroup}>
                                    <button className="btn-main" onClick={() => handleModal('Redelegate', props.validator.operator_address, props.validator.description.moniker)} >Redelegate</button>
                                    <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={() => handleModal('Unbond', props.validator.operator_address, props.validator.description.moniker)}>Unbond</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => handleModal('Withdraw', props.validator.operator_address, props.validator.description.moniker)}>Claim
                                            Rewards</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            {/*<Dropdown className="more-dropdown">*/}
                            {/*    <Dropdown.Toggle variant="success" className="button button-primary"*/}
                            {/*                     id="dropdown-basic">*/}
                            {/*        Actions <Icon viewClass="arrow-right" icon="right-coursel"/>*/}
                            {/*    </Dropdown.Toggle>*/}

                            {/*</Dropdown>*/}
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
                                handleClose={handleClose}
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
                                handleClose={handleClose}
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
                                handleClose={handleClose}
                            />
                            : null
                    }
                </Modal>
            }




        </>
    );
};


export default ModalActions;
