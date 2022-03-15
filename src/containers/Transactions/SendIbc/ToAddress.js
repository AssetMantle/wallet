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
    const chainInfo = useSelector((state) => state.sendIbc.chainInfo.value);
    console.log(chainInfo, "in to add");
    const disable = (
        chainInfo.chain === ''
    );
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
        const dd= "gravity15md2qvgma8lnvqv67w0umu2paqkqkhega6t5dh";
        console.log(dd.length);
        if(!chainInfo.customChain){
            dispatch(setTxIbcSendAddress({
                value: evt.target.value,
                error: validateAddress(evt.target.value, chainInfo.selectedChannel.name),
            }));
        }
    };

    const popover = (
        <Popover id="popover">
            <Popover.Content>
                Recipient’s address starts with {!chainInfo.customChain ? chainInfo.selectedChannel.name : ""}
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
                    disable={disable}
                />
            </div>
        </>
    );
};


export default ToAddress;
