const crypto = require("crypto");
const passwordHashAlgorithm = "sha512";
function randomNum(min, max) {
    let randomNumbers = [];
    for(var i=0;i<3;i++){
        var random_number = Math.floor(Math.random()*(max - min) + min);
        if (randomNumbers.indexOf(random_number) == -1) {
            randomNumbers.push( random_number );
        }

    }
    return randomNumbers;
}
function stringTruncate(str){
    if(str.length > 30){
        return str.substr(0,18) + '...' + str.substr(str.length-10, str.length);
    }
    return str;
}

function createStore(mnemonic, password) {
    try {
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
        let encrypted = cipher.update(mnemonic);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        let obj ={
            "hashpwd": crypto.createHash(passwordHashAlgorithm).update(password).digest("hex"),
            "iv": iv.toString("hex"),
            "salt": key.toString("hex"),
            "crypted": encrypted.toString("hex")
        }
        return {
            Response: obj
        };
    } catch (exception) {
        return {
            success: false,
            error: exception.message
        };
    }
}
module.exports = {
    randomNum,
    stringTruncate,
    createStore,
};