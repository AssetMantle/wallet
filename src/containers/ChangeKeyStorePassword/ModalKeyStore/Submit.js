import React from 'react';
import Button from "./../../../components/Button";
import {useDispatch, useSelector} from "react-redux";
import helper from "../../../utils/helper";
import transactions from "../../../utils/transactions";
import wallet from "../../../utils/wallet";
import {hideKeyStoreModal, setResult, showKeyStoreNewPasswordModal} from "../../../store/actions/changePassword";

const Submit = () => {
    const password = useSelector((state) => state.keyStore.password);
    const keyStore = useSelector((state) => state.keyStore.keyStore);

    const accountNumber = useSelector((state) => state.advanced.accountNumber);
    const accountIndex = useSelector((state) => state.advanced.accountIndex);
    const bip39PassPhrase = useSelector((state) => state.advanced.bip39PassPhrase);

    const dispatch = useDispatch();

    const onClick = () => {
        let filePath = keyStore.value.name;
        if (helper.fileTypeCheck(filePath)) {
            const fileReader = new FileReader();
            fileReader.readAsText(keyStore.value, "UTF-8");
            fileReader.onload = async event => {
                const res = JSON.parse(event.target.result);

                const decryptedData = helper.decryptStore(res, password.value);
                if (decryptedData.error != null) {
                    dispatch(setResult(
                        {
                            value: '',
                            error: {
                                message: decryptedData.error
                            }
                        }));
                } else {
                    let mnemonic = helper.mnemonicTrim(decryptedData.mnemonic);
                    const walletPath = transactions.makeHdPath(helper.getAccountNumber(accountNumber.value), helper.getAccountNumber(accountIndex.value));
                    const responseData = await wallet.createWallet(mnemonic, walletPath, bip39PassPhrase.value);
                    dispatch(setResult(
                        {
                            value: responseData,
                            error: {
                                message: ''
                            }
                        }));
                    dispatch(hideKeyStoreModal());
                    dispatch(showKeyStoreNewPasswordModal());
                }
            };
        } else {
            dispatch(setResult(
                {
                    value: '',
                    error: {
                        message: 'File type not supported'
                    }
                }));
            console.log("error");
        }
    };

    const disable = (
        keyStore.error.message !== '' || password.error.message !== '' || accountNumber.error.message !== '' || accountIndex.error.message !== '' || bip39PassPhrase.error.message !== ''
    );

    return (
        <div className="buttons">
            <div className="button-section">
                <Button
                    className="button button-primary"
                    type="button"
                    disable={disable}
                    value="Submit"
                    onClick={onClick}
                />
            </div>
        </div>
    );
};

export default Submit;
