import React from "react";
import "../utils/kepler";
import KeplerWallet from "../utils/kepler";
import {useHistory} from "react-router-dom";
const KeplerHome = () => {
    const history = useHistory();
    const handleKepler = ()=>{
        const kepler = KeplerWallet();

        kepler.then(function (item) {
            console.log(kepler,"kepler response")
        }).catch(err => alert(err));

        console.log(localStorage.getItem('address'),"address");

        const address = localStorage.getItem('address');
        if(address !== undefined && address !== null && address !== ""){
            localStorage.setItem('loginToken', 'loggedIn');
            history.push('/dashboard/wallet');
        }
    };
    return (
        <div className="buttons">
            <button className="button button-primary" onClick={()=>handleKepler("kepler")}>Use Kepler</button>
        </div>
    )
};
export default KeplerHome;