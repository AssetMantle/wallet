import { Modal as ReactModal } from 'react-bootstrap';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hideKeplrModal, fetchKeplrAddress} from "../../../../store/actions/signIn/keplr";
import {showSignInModal} from "../../../../store/actions/signIn/modal";
import Icon from "../../../../components/Icon";
import {useTranslation} from "react-i18next";
import ButtonContinue from "./ButtonContinue";
// import ModalKeplerInstall from "../../../../views/Kepler/ModalKeplerInstall";
import Button from "../../../../components/Button";

const KeplrModal = () => {
    const {t} = useTranslation();
    const show = useSelector((state) => state.signInKeplr.keplrModal);
    const info = useSelector((state) => state.signInKeplr.keplrInfo);

    console.log(info, "info");
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideKeplrModal());
    };

    window.addEventListener("keplr_keystorechange", () => {
        dispatch(fetchKeplrAddress());
    });

    const keyStorePrevious = () => {
        dispatch(hideKeplrModal());
        dispatch(showSignInModal());
    };

    useEffect(()=>{
        dispatch(fetchKeplrAddress());
    },[]);

    return (
        <ReactModal
            animation={false}
            backdrop="static"
            className="create-wallet-modal seed"
            centered={true}
            keyboard={false}
            show={show}
            onHide={handleClose}>
            <ReactModal.Header closeButton>
                <div className="previous-section">
                    <button className="button" onClick={() => keyStorePrevious("advancedForm")}>
                        <Icon
                            viewClass="arrow-right"
                            icon="left-arrow"/>
                    </button>
                </div>
                <h3 className="heading">{t("SIGN_IN")}</h3>
            </ReactModal.Header>

            <ReactModal.Body className="create-wallet-body create-wallet-form-body">
                {info.error.message ?
                    <>
                        <div className="buttons">
                            <Button
                                className="button button-primary"
                                type="button"
                                value={t("CONNECT")}
                                onClick={fetchKeplrAddress()}
                            />
                        </div>
                        {
                            <div className="text">
                                <p>{t("KEPLER_ERROR")}</p>
                                <p className="form-error">{info.error.message}</p>
                            </div>
                        }
                    </>
                    :
                    <>
                        <p>{t("KEPLER_ACCOUNT_NOTE")}</p>
                        <div className="buttons-list">
                            {
                                info.value !== ""
                                    ?
                                    <p>{info.value}</p>
                                    : <p>Fetching Address..</p>

                            }
                        </div>
                        <div className="button-section mt-3">
                            <ButtonContinue/>
                        </div>

                    </>
                }

            </ReactModal.Body>
        </ReactModal>
    );
};

export default KeplrModal;
