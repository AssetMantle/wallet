import React, { useEffect, useState } from "react";
import Wallet from "../../containers/Wallet";
import DashboardHeader from "../../containers/Common/DashboardHeader";
import GenerateKeyStore from "../../containers/GenerateKeyStore";
import ChangeKeyStorePassword from "../../containers/ChangeKeyStorePassword";
import {useDispatch} from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { LOGIN_INFO} from "../../constants/localStorage";
import {fetchDelegationsCount} from "../../store/actions/delegations";
import {fetchBalance, fetchTransferableVestingAmount} from "../../store/actions/balance";
import {fetchRewards, fetchTotalRewards} from "../../store/actions/rewards";
import {fetchUnbondDelegations} from "../../store/actions/unbond";
import {fetchTokenPrice} from "../../store/actions/tokenPrice";
import {fetchValidators} from "../../store/actions/validators";
import {updateFee} from "../../utils/helper";
import {ledgerDisconnect} from "../../utils/ledger";
import LoadingComponent from "../../components/LoadingComponent";

const DashboardWallet = () => {
    console.log("inside DashboardWallet");
    const {loginMode} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const loginModesArray = ["keplr", "ledger", "keystore"];

    const fetchApi = async (address, loginMode) => {
        if (address !== null && address !== undefined) {
            await Promise.all([
                dispatch(fetchDelegationsCount(address)),
                dispatch(fetchBalance(address)),
                dispatch(fetchRewards(address)),
                dispatch(fetchTotalRewards(address)),
                dispatch(fetchUnbondDelegations(address)),
                dispatch(fetchTokenPrice()),
                dispatch(fetchTransferableVestingAmount(address)),
                dispatch(fetchValidators(address)),
                updateFee(address),
                setInterval(() => dispatch(fetchTotalRewards(address)), 10000),
            ]);
            if(loginMode === "ledger"){
                ledgerDisconnect(dispatch, history);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        console.log("inside useEffect of DashboardWallet");
        let address;
        let loginModeLocal;
        const loginInfo = JSON.parse(localStorage.getItem(LOGIN_INFO)) || {};

        if(!loginInfo || loginInfo.address == null || loginInfo.address == undefined || loginInfo.loginMode == null || loginInfo.loginMode == undefined) {
            history.push('/');
            return;
        }
        
        address = loginInfo && loginInfo.address;
        loginModeLocal = loginInfo && loginInfo.loginMode;
        console.log("address: ", address, " loginMode: ", loginMode, " loginModeLocal: ", loginModeLocal);

        // if the dynamic uri path is missing or doesnt match the current logged in mode, then redirect to correct one
        if(!loginMode || loginModesArray.indexOf(loginMode) == -1 || loginMode !== loginModeLocal) {
            history.push(`/dashboard/${loginModeLocal}`);
            return;
        } else {
            setLoading(true);

            // retrieve wallet related details
            fetchApi(address, loginModeLocal);
        }
        
    }, [loginMode]);
    
    if(loading) {
        return <LoadingComponent />;
    }

    return (
        <div className="main-section">
            <DashboardHeader/>
            <GenerateKeyStore/>
            <ChangeKeyStorePassword/>
            <div className="content-section container">
                <Wallet/>
            </div>
        </div>
    );
};

export default DashboardWallet;
