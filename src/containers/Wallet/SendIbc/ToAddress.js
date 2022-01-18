import React from 'react';
import {OverlayTrigger, Popover} from "react-bootstrap";
import Icon from "../../../components/Icon";
import InputText from "../../../components/InputText";
import {useDispatch, useSelector} from "react-redux";
import {setTxIbcSendAddress} from "../../../store/actions/transactions/sendIbc";
import {useTranslation} from "react-i18next";
import {validateAddress, ValidateAlphaNumeric} from "../../../utils/validations";

const ToAddress = () => {
    const {t} = useTranslation();
    const toAddress = useSelector((state) => state.sendIbc.toAddress);
    const dispatch = useDispatch();

    const onChange = (evt) => {
        dispatch(setTxIbcSendAddress({
            value: evt.target.value,
            error: {
                message: ''
            }
        }));
    };

    const onBlur = (evt) => {
        dispatch(setTxIbcSendAddress({
            value: evt.target.value,
            error: validateAddress(evt.target.value),
        }));
    };

    const popover = (
        <Popover id="popover">
            <Popover.Content>
                {t("RECIPIENT_ADDRESS_EXAMPLE")}
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
                    type="text"
                    value={toAddress.value}
                    required={true}
                    error={toAddress.error}
                    onKeyPress={ValidateAlphaNumeric}
                    onBlur={onBlur}
                    placeholder="Enter Recipient's address"
                    autofocus={false}
                    onChange={onChange}
                />
            </div>
        </>
    );
};


export default ToAddress;
