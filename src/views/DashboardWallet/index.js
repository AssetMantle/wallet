import React, { useEffect, useState } from "react";
import Wallet from "../../containers/Wallet";
import DashboardHeader from "../../containers/Common/DashboardHeader";
import GenerateKeyStore from "../../containers/GenerateKeyStore";
import ChangeKeyStorePassword from "../../containers/ChangeKeyStorePassword";
import {useDispatch} from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { LOGIN_INFO} from "../../constants/localStorage";
import {addressDetails, setAddress} from "../../store/actions/signIn/address";
import {fetchDelegationsCount} from "../../store/actions/delegations";
import {fetchBalance, fetchTransferableVestingAmount} from "../../store/actions/balance";
import {fetchRewards, fetchTotalRewards} from "../../store/actions/rewards";
import {fetchUnbondDelegations} from "../../store/actions/unbond";
import {fetchTokenPrice} from "../../store/actions/tokenPrice";
import {fetchValidators} from "../../store/actions/validators";
import {updateFee} from "../../utils/helper";
import {ledgerDisconnect} from "../../utils/ledger";
import RouteNotFound from "../../components/RouteNotFound";  
import { validateAddress } from "../../utils/validations";
import { isBech32Address } from "../../utils/scripts";
import { DefaultChainInfo } from "../../config";
import LoadingComponent from "../../components/LoadingComponent";

const DashboardWallet = () => {
    console.log("inside DashboardWallet");
    const {walletAddress} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [invalidPage, setInvalidPage] = useState(false);

    const fetchApi = async (address, loginInfo) => {
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
            if(loginInfo && loginInfo.loginMode === "ledger"){
                ledgerDisconnect(dispatch, history);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        console.log("inside useEffect of DashboardWallet");
        let address;
        const loginInfo = JSON.parse(localStorage.getItem(LOGIN_INFO)) || {};

        if((walletAddress == null || walletAddress == undefined) && (loginInfo.address == null || loginInfo.address == undefined)) {
            history.push('/');
            return;
        } 
        else {
            if(walletAddress) {
                address = walletAddress;
                if(!(address && validateAddress(address) && isBech32Address(address, DefaultChainInfo.prefix))) {
                    setInvalidPage(true);
                    return;
                }
                setLoading(true);

                // if match params exist then fetch address details using the param
                localStorage.removeItem(LOGIN_INFO);

                // assign the value of signIn.address
                dispatch(setAddress({
                    value: address,
                    error: {
                        message: ''
                    }
                }));
                
                // retrieve login info details
                dispatch(addressDetails(address));

                // retrieve wallet related details
                fetchApi(address, loginInfo);

            } else if(!(loginInfo.address == null || loginInfo.address == undefined)) {
                address = loginInfo && loginInfo.address;
                setLoading(true);
                // assign the value of signIn.address
                dispatch(setAddress({
                    value: address,
                    error: {
                        message: ''
                    }
                }));
                
                // retrieve wallet related details
                fetchApi(address, loginInfo);

            } else {
                history.push('/');
                return;
            }
            
        }

    }, [walletAddress]);
    
    if(loading) {
        return <LoadingComponent />;
    }

    if(invalidPage) {
        return <RouteNotFound />;
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
