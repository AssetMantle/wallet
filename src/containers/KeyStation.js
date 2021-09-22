import React, {useState, useCallback} from "react";
import Keystation from "@cosmostation/keystation-es6";
import {SendMsg} from "../utils/protoMsgHelper";

const KeyStation = () => {
    const [myKeystation, setMyKeystation] = useState(new Keystation);
    const connectKeystation = useCallback(() => {
        let myKeystation = new Keystation();
        setMyKeystation(myKeystation);
        myKeystation.client = "http://localhost:3000";
        myKeystation.lcd = "https://persistence.testnet.rest.audit.one";
        myKeystation.path = "44/750/0/0/0";

        let prefix = "persistence";
        let popup = myKeystation.openWindow("signin", prefix);
        let popupTick = setInterval(function() {
            if (popup.closed) {
                clearInterval(popupTick);
                console.log("window closed!");
            }
        }, 500);
    }, []);
    console.log(myKeystation, "myKeystation");

    var keystationAccount = "";
    const msgs = [SendMsg('persistence1wv9879c57ag7zthrtcvundrw3yvvt0a92wmmhq', 'persistence1wv9879c57ag7zthrtcvundrw3yvvt0a92wmmhq', '1', 'uxprt')];
    var txJson = {
        "account_number": "30",
        "chain_id": "test-core-1",
        "fee": {
            "amount": [
                {
                    "amount": "0",
                    "denom": "upxrt"
                }
            ],
            "gas": "250000"
        },
        "memo": "",
        msgs,
        "sequence": "1020"
    };

    console.log(txJson, "txJson txJson");

    // var txJson = {
    //     "chain_id": "test-core-1",
    //     "fee": {
    //         "amount": [
    //             {
    //                 "amount": "0",
    //                 "denom": "upxrt"
    //             }
    //         ],
    //         "gas": "250000"
    //     },
    //     "memo": "",
    //
    //     "msgs": [
    //         {
    //             "type": "cosmos-sdk/MsgSend",
    //             "value": {
    //                 "amount": [
    //                     {
    //                         "amount":"11",
    //                         "denom": "uxprt"
    //                     }
    //                 ],
    //                 "from_address": "persistence1wv9879c57ag7zthrtcvundrw3yvvt0a92wmmhq",
    //                 "to_address": "persistence1wv9879c57ag7zthrtcvundrw3yvvt0a92wmmhq"
    //             }
    //         }
    //     ],
    //     "sequence": "1019"
    // };
    //

    var txJsonStr = JSON.stringify(txJson);
    async function send  () {
        console.log(txJsonStr, keystationAccount, "connectKeystation");
        var popup = myKeystation.openWindow("transaction", txJsonStr, 'persistence');
        console.log(popup, "popup");
        var popupTick = setInterval(function() {
            if (popup.closed) {
                clearInterval(popupTick);
                console.log("window closed!");
            }
        }, 500);
    }


    window.addEventListener("message", function(e) {
        if (e.origin != "https://keystation.cosmostation.io") return;
        console.log(e.data, "account data");
        // e.data.account : User's keychain account. Remember this account!
        keystationAccount = e.data.account;
    } , false);

    return(
        <>
            <button onClick={connectKeystation}>Login</button>
            <button onClick={send}>Send</button>
        </>

    );
};
export default KeyStation;