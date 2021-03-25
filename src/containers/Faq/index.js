import {Tab, Nav, Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import Icon from "../../components/Icon";
import WalletFaq from "./WalletFaq";
import StakingFaq from "./StakingFaq";
const ModalFaq = (props) => {
    const [show, setShow] = useState(true);

    const handleClose = (amount) => {
        setShow(false);
        props.setShowFaq(false);
    };


    return (
        <Modal
            animation={false}
            centered={true}
            show={show}
            size="lg"
            className="modal-custom faq-modal"
            onHide={handleClose}>
            <Modal.Header className="result-header">
                Frequently Asked Questions
            </Modal.Header>
            <Modal.Body className="faq-modal-body">
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                            <Nav variant="pills">
                                <div className="box">
                                    <Nav.Link eventKey="first"><Icon
                                        viewClass="arrow-right"
                                        icon="wallet"/>
                                        <p>Wallet</p>
                                    </Nav.Link>
                                </div>
                                {/*<div className="box">*/}
                                {/*    <Nav.Link eventKey="second"><Icon*/}
                                {/*        viewClass="arrow-right"*/}
                                {/*        icon="staking"/>*/}
                                {/*    <p>Staking</p></Nav.Link>*/}
                                {/*</div>*/}
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                <WalletFaq/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <StakingFaq/>
                                </Tab.Pane>
                            </Tab.Content>
                </Tab.Container>
            </Modal.Body>
        </Modal>
    );
};


export default ModalFaq;
