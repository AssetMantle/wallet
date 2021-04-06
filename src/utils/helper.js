const crypto = require("crypto");
const passwordHashAlgorithm = "sha512";

function randomNum(min, max) {
    let randomNumbers = [];
    for (var i = 0; i < 3; i++) {
        var random_number = Math.floor(Math.random() * (max - min) + min);
        if (randomNumbers.indexOf(random_number) == -1) {
            randomNumbers.push(random_number);
        }

    }
    return randomNumbers;
}

function stringTruncate(str) {
    if (str.length > 30) {
        return str.substr(0, 10) + '...' + str.substr(str.length - 10, str.length);
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

        let obj = {
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

function decryptStore(fileData, password) {
    let hashpwd = fileData.hashpwd
    let iv = fileData.iv
    let salt = fileData.salt
    let crypted = fileData.crypted

    if (hashpwd === crypto.createHash(passwordHashAlgorithm).update(password).digest("hex")) {
        let ivText = Buffer.from(iv, "hex");
        let encryptedText = Buffer.from(crypted, "hex");

        let decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            Buffer.from(salt, "hex"),
            ivText
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return {
            mnemonic: decrypted.toString(),
        };
    } else {
        return {
            error: "Incorrect password."
        };
    }
}

function isActive(item) {
    return item.jailed === false && item.status === 'BOND_STATUS_BONDED';
}

function ValidateFrom(value) {
    if (value.length === 0) {
        return new Error('Length must be greater than 0');
    }
    return new Error('');
}

function CheckLastPage(pageNumber, limit, totalTransactions) {
    return totalTransactions / limit <= pageNumber;
}

function ValidatePassphrase(value) {
    return value.length === 50;

}

function ValidateAddress(address) {
    return address.startsWith("persistence1") && address.length === 50;
}

module.exports = {
    randomNum,
    stringTruncate,
    createStore,
    decryptStore,
    isActive,
    ValidateFrom,
    ValidatePassphrase,
    CheckLastPage,
    ValidateAddress
};