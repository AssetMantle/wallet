import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";
import ibcConfig from "../../../ibcConfig";
import {setTxIbcSendChainInfo} from "../../../store/actions/transactions/sendIbc";

const IBC_CONF = process.env.REACT_APP_IBC_CONFIG;

const Chain = () => {
    const {t} = useTranslation();
    const chainInfo = useSelector((state) => state.sendIbc.chainInfo.value);
    const dispatch = useDispatch();

    let channels = [];
    if (IBC_CONF === "ibcStaging.json") {
        channels = ibcConfig.testNetChannels;
    } else {
        channels = ibcConfig.mainNetChannels;
    }

    const onChangeSelect = (evt) => {
        if (evt.target.value === "Custom") {
            dispatch(
                setTxIbcSendChainInfo({
                    value: {
                        customChain: true,
                        chainID: '',
                        chain: evt.target.value,
                        selectedChannel: ''
                    },
                })
            );
        } else {
            let id = evt.target.value.substr(evt.target.value.indexOf('/') + 1);
            channels.forEach(async (item) => {
                if (evt.target.value === item.id) {
                    dispatch(
                        setTxIbcSendChainInfo({
                            value: {
                                customChain: false,
                                chainID: id,
                                chain: evt.target.value,
                                selectedChannel: item
                            },
                        })
                    );
                }
            });
        }
    };

    return (
        <>
            <div className="form-field">
                <p className="label">{t("CHAIN")}</p>
                <div className="form-control-section flex-fill">
                    <Select value={chainInfo.chain} className="validators-list-selection"
                        onChange={onChangeSelect} displayEmpty>
                        <MenuItem value="" key={0}>
                            <em>{t("SELECT_CHAIN")}</em>
                        </MenuItem>
                        {
                            channels.map((channel, index) => {
                                return (
                                    <MenuItem
                                        key={index + 1}
                                        className=""
                                        value={channel.id}>
                                        {channel.name} ({channel.id.substr(channel.id.indexOf('/') + 1)} / {channel.port})
                                    </MenuItem>
                                );
                            })
                        }
                        <MenuItem
                            key={channels.length + 1}
                            className=""
                            value="Custom">
                            {t("CUSTOM")}
                        </MenuItem>
                    </Select>
                </div>
            </div>
            {chainInfo.selectedChannel ?
                <div className="form-field form-control-section">
                    <p className="label info">{t("DESCRIPTION")}</p>
                    <div className="amount-field"><span
                        className="description-info">{chainInfo.selectedChannel.description}</span></div>
                </div>

                : ""}
        </>

    );
};

export default Chain;
