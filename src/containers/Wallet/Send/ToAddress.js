import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import Icon from "../../../components/Icon";
import InputText from "../../../components/InputText";
import helper from "../../../utils/helper";
import {useDispatch, useSelector} from "react-redux";
import {setTxSendAddress}from "../../../store/actions/transactions/send";
import {useTranslation} from "react-i18next";
import {ValidateAlphaNumeric} from "../../../utils/validations";
const ToAddress = () => {
    const {t} = useTranslation();
    const toAddress = useSelector((state) => state.send.toAddress);
    const dispatch = useDispatch();
    console.log(toAddress, "AFTER CLOSE");
    const onChange = (evt) => {
        dispatch(setTxSendAddress({
            value:evt.target.value.toString(),
            error: {
                message: ''
            }
        }));
    };

    const onBlur = (evt) =>{
        dispatch(setTxSendAddress({
            value:evt.target.value.toString(),
            error: helper.validateAddress(evt.target.value),
        }));
    };

    const popover = (
        <Popover id="popover">
            <Popover.Content>
                Recipient’s address starts with persistence; for example:
                persistence14zmyw2q8keywcwhpttfr0d4xpggylsrmd4caf4
            </Popover.Content>
        </Popover>
    );
    return (
        <>
            <div className="form-field">
                <p className="label info">{t("RECIPIENT_ADDRESS")}
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
                        <button className="icon-button info" type="button"><Icon
                            viewClass="arrow-right"
                            icon="info"/></button>
                    </OverlayTrigger></p>
                <InputText
                    className="form-control"
                    name="address"
                    placeholder="Enter Recipient's address"
                    required={true}
                    type="text"
                    value={toAddress.value}
                    onKeyPress={ValidateAlphaNumeric}
                    onBlur={onBlur}
                    error={toAddress.error}
                    onChange={onChange}
                />
            </div>
        </>
    );
};


export default ToAddress;
