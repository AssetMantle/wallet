import { Modal as ReactModal } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchCosmostationAddress, hideCosmostationModal } from "../../../../store/actions/signIn/cosmostation";
import { showSignInModal } from "../../../../store/actions/signIn/modal";
import Icon from "../../../../components/Icon";
import { useTranslation } from "react-i18next";
import ButtonContinue from "./ButtonContinue";
import Button from "../../../../components/Button";
import ModalCosmostationInstall from "../../../../views/Cosmostation/ModalCosmostationInstall";

const CosmostationModal = () => {
    const { t } = useTranslation();
    const show = useSelector((state) => state.signInCosmostation.cosmostationModal);
    const info = useSelector((state) => state.signInCosmostation.cosmostationInfo);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideCosmostationModal());
    };

    window.addEventListener("keplr_keystorechange", () => {
        dispatch(fetchCosmostationAddress());
    });

    const keyStorePrevious = () => {
        dispatch(hideCosmostationModal());
        dispatch(showSignInModal());
    };

    useEffect(() => {
        if (show) {
            dispatch(fetchCosmostationAddress());
        }
    }, [show]);

    const reconnectHandler = () => {
        dispatch(fetchCosmostationAddress());
    };

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
                            icon="left-arrow" />
                    </button>
                </div>
                <h3 className="heading">{t("SIGN_IN")}</h3>
            </ReactModal.Header>

            <ReactModal.Body className="create-wallet-body create-wallet-form-body">
                {info.error.message ?
                    <>
                        <div className="buttons mb-3">
                            <Button
                                className="button button-primary"
                                type="button"
                                value={t("CONNECT")}
                                onClick={reconnectHandler}
                            />
                        </div>
                        {
                            info.error.message === "install cosmostation extension" ?
                                <ModalCosmostationInstall />
                                :
                                <div>
                                    <p className="m-0 text-center">{t("COSMOSTATION_ERROR")}</p>
                                    <p className="form-error">{info.error.message}</p>
                                </div>
                        }
                    </>
                    :
                    <>
                        <p>{t("COSMOSTATION_ACCOUNT_NOTE")}</p>
                        <div className="buttons-list">
                            {
                                info.value !== ''
                                    ?
                                    <p>{info.value}</p>
                                    : <p>{t("FETCHING_ADDRESS")}..</p>

                            }
                        </div>
                        <div className="button-section mt-3">
                            <ButtonContinue />
                        </div>

                    </>
                }
            </ReactModal.Body>
        </ReactModal>
    );
};

export default CosmostationModal;
