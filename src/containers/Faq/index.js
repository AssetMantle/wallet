import {Modal, Nav, Tab} from 'react-bootstrap';
import React, {useState} from 'react';
import Icon from "../../components/Icon";
import WalletFaq from "./WalletFaq";
import StakingFaq from "./StakingFaq";
import {useTranslation} from "react-i18next";

const ModalFaq = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(false);
    };

    return (
        <Modal
            animation={false}
            centered={true}
            show={show}
            backdrop="static"
            size="lg"
            className={`modal-custom faq-modal ${props.className}`}
            onHide={handleClose}>
            <Modal.Header className="result-header" closeButton>
                {t("FAQ")}
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
                        <div className="box">
                            <Nav.Link eventKey="second"><Icon
                                viewClass="arrow-right"
                                icon="staking"/>
                            <p>Staking</p></Nav.Link>
                        </div>
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
