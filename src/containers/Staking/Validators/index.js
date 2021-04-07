import React, {useEffect} from "react";
import {Tab, Nav,} from "react-bootstrap";
import Loader from "../../../components/Loader";
import ValidatorsTable from "./ValidatorsTable";
import {fetchValidators} from "../../../actions/validators";
import {connect} from "react-redux";
import InfoRefresh from "../../Refresh";
import {useTranslation} from "react-i18next";

const Validators = (props) => {
    const {t} = useTranslation();
    useEffect(() => {
        const address = localStorage.getItem('address');
        props.fetchValidators(address);
    }, []);

    if (props.inProgress) {
        return <Loader/>;
    }

    return (
        <div className="txns-container">
            <Tab.Container id="left-tabs-example" defaultActiveKey="active">
                <div className="tab-header">
                    <div className="info">
                        <div className="left">
                            <p className="info-name"> {t("CHOOSE_VALIDATOR")}</p>
                            <Nav variant="pills">
                                <Nav.Item>
                                    <Nav.Link eventKey="active"> {t("ACTIVE")}</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="inactive"> {t("IN_ACTIVE")}</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                       <div>
                           <InfoRefresh/>
                       </div>
                        {/*<p className="info-value"><span>Lifetime Rewards: </span>125,000 XPRT</p>*/}
                    </div>

                </div>
                <Tab.Content>
                    <Tab.Pane eventKey="active">
                        <ValidatorsTable validatorsList={props.activeList}
                                         activeValidatorsTokens={props.activeVotingPower.active}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="inactive">
                        <ValidatorsTable validatorsList={props.inActiveList}
                                         inActiveValidatorsTokens={props.inActiveVotingPower.inActive}/>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    );
};

const stateToProps = (state) => {
    return {
        activeList: state.validators.activeList,
        inActiveList: state.validators.inActiveList,
        activeVotingPower: state.validators.activeVotingPower,
        inActiveVotingPower: state.validators.inActiveVotingPower,
        inProgress: state.validators.inProgress,
    };
};

const actionsToProps = {
    fetchValidators,
};

export default connect(stateToProps, actionsToProps)(Validators);
