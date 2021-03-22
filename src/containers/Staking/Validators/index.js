import React, {useEffect, useState} from "react";
import {Table, Modal, Dropdown, Tab, Nav,} from "react-bootstrap";
import {getDelegationsUrl, getValidatorsUrl, getValidatorUrl} from "../../../constants/url";
import helper from "../../../utils/helper"
import axios from "axios";
import Avatar from "./Avatar";
import Loader from "../../../components/Loader";
import Lodash from 'lodash';
import Icon from "../../../components/Icon";
import ModalActions from "./ModalActions";
import ValidatorsTable from "./ValidatorsTable";
const Validators = (props) => {
    const [modalDelegate, setModalOpen] = useState();
    const [loading, setLoading] = useState(true);
    const [validator, setValidator] = useState('');
    const [activeValidatorsTokens, setActiveValidatorsTokens] = useState(0);
    const [inActiveValidatorsTokens, setInActiveValidatorsTokens] = useState(0);
    const [validatorsList, setValidatorsList] = useState([]);
    const [activeValidatorsList, setActiveValidatorsList] = useState([]);
    const [inActiveValidatorsList, setInActiveValidatorsList] = useState([]);
    const handleModal = (name, validator) => {
        setModalOpen(name);
        setValidator(validator);
    };
    useEffect(() => {
        const fetchValidators = async () => {
            const address = localStorage.getItem('address');
            console.log(address, "loggedIn address");
            const validatorUrl = getValidatorsUrl();
            await axios.get(validatorUrl).then(response => {
                let validators = response.data.validators;
                const active = Lodash.sumBy(validators, (item) => {
                    return helper.isActive(item) ? item.tokens : 0;
                });
                let activeValidators=[];
                let inActiveValidators=[];
                validators.forEach((item) => {
                    if(helper.isActive(item)) {
                        activeValidators.push(item)
                    } else {
                        inActiveValidators.push(item)
                    }
                });
                setActiveValidatorsList(activeValidators);
                setInActiveValidatorsList(inActiveValidators);
                setActiveValidatorsTokens(active);
                const inactive = Lodash.sumBy(validators, (item) => {
                    return helper.isActive(item) ? 0 : item.tokens;
                });
                setInActiveValidatorsTokens(inactive);
                setValidatorsList(validators);
                setLoading(false);
            }).catch(error => {
                console.log(error.response, "unable to loading validators")
                setLoading(false);
            });

        };
        fetchValidators();
    }, []);
    if (loading) {
        return <Loader/>;
    }
    return (
        <div className="txns-container">
            <Tab.Container id="left-tabs-example" defaultActiveKey="active">
                        <div className="tab-header">
                            <div className="info">
                                <div className="left">
                                    <p className="info-name">Choose a Validator</p>
                                    <Nav variant="pills">
                                        <Nav.Item>
                                            <Nav.Link eventKey="active">Active</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="inactive">Inactive</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </div>
                                {/*<p className="info-value"><span>Lifetime Rewards: </span>125,000 XPRT</p>*/}
                            </div>

                        </div>
                        <Tab.Content>
                            <Tab.Pane eventKey="active">
                                <ValidatorsTable validatorsList={activeValidatorsList} activeValidatorsTokens={activeValidatorsTokens} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="inactive">
                                <ValidatorsTable validatorsList={inActiveValidatorsList} inActiveValidatorsTokens={inActiveValidatorsTokens} />
                            </Tab.Pane>
                        </Tab.Content>
            </Tab.Container>
            {/*<Table responsive borderless>*/}
            {/*    <thead>*/}
            {/*    <tr>*/}
            {/*        <th>Validator</th>*/}
            {/*        <th>Voting Power</th>*/}
            {/*        <th>Commission</th>*/}
            {/*        <th>Status</th>*/}
            {/*        <th></th>*/}
            {/*    </tr>*/}
            {/*    </thead>*/}
            {/*    <tbody>*/}
            {/*    {validatorsList.length ?*/}
            {/*        validatorsList.map((validator, index) => {*/}
            {/*            let commissionRate = validator.commission.commission_rates.rate * 100;*/}
            {/*            commissionRate = parseFloat(commissionRate.toFixed(2)).toLocaleString();*/}
            {/*            const active = helper.isActive(validator);*/}
            {/*            let votingPower = validator.tokens * Math.pow(10, -6);*/}
            {/*            let votingPowerPercentage = active*/}
            {/*                ? validator.tokens * 100 / activeValidatorsTokens*/}
            {/*                : validator.tokens * 100 / inActiveValidatorsTokens;*/}
            {/*            votingPower = parseFloat(votingPower.toFixed(2)).toLocaleString();*/}
            {/*            votingPowerPercentage = parseFloat(votingPowerPercentage.toFixed(2)).toLocaleString();*/}
            {/*            return (*/}
            {/*                <tr key={index}>*/}
            {/*                    <td className=""><Avatar*/}
            {/*                        identity={validator.description.identity}/> {validator.description.moniker}</td>*/}
            {/*                    <td className="">{`${votingPower} (${votingPowerPercentage}%)`}</td>*/}
            {/*                    <td className="">{commissionRate} %</td>*/}
            {/*                    <td className="">*/}
            {/*                        {active ?*/}
            {/*                            <span className="icon-box success" title="active">*/}
            {/*                            <Icon*/}
            {/*                                viewClass="arrow-right"*/}
            {/*                                icon="success"/>*/}
            {/*                            </span>*/}
            {/*                            :*/}
            {/*                            <span className="icon-box error" title="Inactive">*/}
            {/*                            <Icon*/}
            {/*                                viewClass="arrow-right"*/}
            {/*                                icon="pending"/>*/}
            {/*                            </span>*/}
            {/*                        }*/}
            {/*                    </td>*/}
            {/*                    <td className="actions-td">*/}
            {/*                        <button*/}
            {/*                            onClick={() => handleModal('ModalActions', validator)}*/}
            {/*                            className="button button-primary">*/}
            {/*                            Actions*/}
            {/*                        </button>*/}
            {/*                    </td>*/}
            {/*                </tr>*/}
            {/*            )*/}
            {/*        })*/}
            {/*        :<tr><td colSpan={5} className="text-center"> No Validators Found</td></tr>*/}
            {/*    }*/}
            {/*    </tbody>*/}
            {/*</Table>*/}
            {
                modalDelegate === 'ModalActions' ?
                    <ModalActions setModalOpen={setModalOpen} validator={validator}/>
                    : null
            }

        </div>
    );
};

export default Validators;
