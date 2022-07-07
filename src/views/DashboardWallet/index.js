import React, { useEffect, useState } from "react";
import Wallet from "../../containers/Wallet";
import DashboardHeader from "../../containers/Common/DashboardHeader";
import GenerateKeyStore from "../../containers/GenerateKeyStore";
import ChangeKeyStorePassword from "../../containers/ChangeKeyStorePassword";
import {useDispatch} from "react-redux";
import { useParams } from "react-router-dom";
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

const DashboardWallet = () => {


    const {walletAddress} = useParams();
    const dispatch = useDispatch();
    // const history = useHistory();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        let address;
        const loginInfo = JSON.parse(localStorage.getItem(LOGIN_INFO)) || {};

        // if match params exist then fetch address details using the param
        if (walletAddress !== null && walletAddress !== undefined){
            address = walletAddress;
        } 

        // if match params doesnt exist then fetch address details using the param
        else {
            address = loginInfo && loginInfo.address;
        } 

        localStorage.removeItem(LOGIN_INFO);
        console.log("address: ", address);

        // assign the value of signIn.address
        dispatch(setAddress({
            value: address,
            error: {
                message: ''
            }
        }));

        dispatch(addressDetails(address));

        const fetchApi = async () => {
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
        fetchApi();

    }, [walletAddress]);
    
    if(loading) {
        return "loading";
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
