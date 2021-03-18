import cosmosjs from "@cosmostation/cosmosjs";

const apiUrl = "http://128.199.29.15:1317";
const chainID = "test-core-1"

const Persistence = cosmosjs.network(apiUrl, chainID)
Persistence.setBech32MainPrefix("persistence");
Persistence.setPath("m/44'/750'/0'/0/0");
Persistence.getAccounts = function (address) {
    let accountsApi = "/cosmos/auth/v1beta1/accounts/";
    return fetch(this.url + accountsApi + address)
        .then(response => response.json())

}

export default Persistence