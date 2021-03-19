import React, {useState} from "react";
import {Table, Modal, Dropdown} from "react-bootstrap";
import ModalDelegate from "./ModalDelegate";
import IconMore from "../../../assets/images/more.svg";
import ModalReDelegate from "./ModalReDelegate";
const Validators = (props) => {
    const [modalDelegate, setModalOpen] = useState('');
    const [externalComponent, setExternalComponent] = useState(false);
    const handleModal = (name) =>{
        setModalOpen(name)
    };
    return (
        <div className="txns-container">
            <Table borderless hover>
                <thead>
                <tr>
                    <th>Validator</th>
                    <th>Voting Power</th>
                    <th>Comission</th>
                    <th>Status</th>
                    <th>Delegate</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="">cosmostation</td>
                    <td className="">4,250,000 (4.25%)</td>
                    <td className="">7.5%</td>
                    <td className=""> r</td>
                    <td className="actions-td">
                        <button type="button" className="button button-primary" onClick={()=>handleModal('Delegate')}>Delegate</button>
                        <Dropdown className="more-dropdown">
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                <img src={IconMore} alt="IconMore"/>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={()=>handleModal('Redelegate')}>Redelegate</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Unbond</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Claim Rewards</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </td>
                </tr>

                </tbody>
            </Table>
            {
                modalDelegate == 'Delegate' ?
                    <ModalDelegate setModalOpen={setModalOpen}/>
                    : null
            }
            {
                modalDelegate == 'Redelegate' ?
                    <ModalReDelegate setModalOpen={setModalOpen}/>
                    : null
            }
        </div>
    );
};

export default Validators;
