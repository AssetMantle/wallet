import {Modal} from "react-bootstrap";
import React from "react";

let English = {
    translations: {
        "HOME_PAGE_TEXT": "Securely store, transfer and stake your XPRT tokens with the Persistence Wallet",
        "HOME_PAGE_SUB_TEXT": "Earn upto 35% annual rewards by staking your XPRT",
        "CREATE_WALLET": "Create Wallet",
        "IMPORT_EXISTS_WALLET": "Import an existing wallet",
        "SIGN_IN": "Sign In",
        "LEARN_MORE": "Learn More",
        "HELP": "Help",
        "FAQ1": "About Persistence",
        "FAQ1A": "Persistence is an interoperable protocol built to facilitate the creation of next-gen\n" +
            "                        financial products. XPRT is Persistence’s native token which is used to secure the Persistence\n" +
            "                        network. Staking rewards for XPRT are expected to be in the range of ~30-40%.",
        "FAQ2": "How to Create a Persistence Wallet",
        "FAQ2_INFO": "You need to have a Persistence wallet to store or transact or stake your XPRT token. Create a wallet or import an already existing Persistence wallet. To create a wallet:",
        "FAQ21": "From wallet.persistence.one site and click the Create a wallet button.",
        "FAQ22": "In the Secure your wallet window, please take a moment to read notes. Click Continue. After carefully reading the steps on how to secure your wallet, Click Next after you go through the info.",
        "FAQ23": "In the Password window, enter a password for the Persistence wallet.",
        "FAQ24": "In the Mnemonic window, you can view a randomly generated 24-word seed phrase (Seed phrase is also called as Mnemonic).",
        "FAQ25": "Enter the password again to confirm.",
        "FAQ26": "Click Next.",
        "FAQ27": "Note: You will require this password when you sign into your wallet. So copy the password in a file. Save and store the file safe.",
        "FAQ28": "In the Mnemonic window, you view the randomly generated 24-word seed phrase, by default. (Seed phrase is also called as Mnemonic.) If you want a 12 word mnemonic, select the 12 button.",
        "FAQ29": "Copy and securely store your seed phrase in a file location of your choice because you may need it in future.",
        "FAQ210": "Select the Private key json file and copy it in a file and store it in a safe location.",
        "FAQ211": "Click Next to create your wallet",
        "FAQ212": "Note: If you already have a Persistence wallet, you can import it using the Import an existing wallet button. You will need to use your mnemonic and password. So keep it handy.",
        "FAQ3": "How to import an existing Persistence wallet?",
        "FAQ31": "Go to wallet.persistence.one site and click the Import an existing wallet button.",
        "FAQ32": "You can import your wallet using either your private key (KeyStore.json file) or your Mnemonic (Seed Phrase).",
        "FAQ33": "To import wallet using Private Key, click on Use Private Key.",
        "FAQ34": "Enter the password used to encrypt your private key. This password will be used to decrypt your KeyStore.json file now.",
        "FAQ35": "Upload your KeyStore file and click on Next. Click next again to successfully import your wallet.",
        "FAQ36": "If you wish to import your wallet using your Seed Phrase (Mnemonic), after clicking on Import an existing wallet, input your mnemonic and click next.",
        "FAQ37": "You can generate your KeyStore file and save it or you can directly skip to importing your wallet.",
        "FAQ38": "Click on Next again to successfully import your wallet.",
        "FAQ4": " What is a mnemonic?",
        "FAQ4A": "Mnemonic is a secret passphrase to recover your private key.",
        "FAQ5": "Telegram Chat",
        "FAQ5A": "Have any more questions? Please feel free to ask more questions in our telegram group.",
        "STAKING_FAQ1": "Sending XPRT Token",
        "STAKING_FAQ11": " Review the XPRT token in your wallet. You may want to send some XPRT token to someone who\n" +
            "                            has a persistence wallet",
        "STAKING_FAQ12": "From the Wallet page, Send tab, copy and paste Recipient Address.\n" +
            "                                You obtain their wallet address off the application.",
        "STAKING_FAQ13": "Enter the XPRT Token in the Amount field.",
        "STAKING_FAQ14": "Optionally, enter your comments or remarks in Memo.",
        "STAKING_FAQ15": "The application calculates the transaction fee in XPRT token and is deducted from your\n" +
            "                                wallet.",
        "STAKING_FAQ16": "Click Send.",
        "STAKING_FAQ17": "Enter your password or mnemonic. Or toggle to upload your keystore json file. A\n" +
            "confirmation message appears after the successful sending of the XPRT token. The\n" +
            "transaction hash link is provided. You can click the link and view the transaction\n" +
            "details or you can review the details under\n" +
            "the Transactions tab. Note: Failed transactions don’t appear in\n" +
            "the Transactions tab.",
        "STAKING_FAQ18": "Click Done to return to the Wallet page.",
        "STAKING_FAQ2": "How to Delegate XPRT Token",
        "STAKING_FAQ21": "Delegate your XPRT token to a validator such as Cosmostation, StakeFish, and so on. As\n" +
            "                        you stake your tokens, you can earn rewards too.",
        "STAKING_FAQ22": "From the Staking page, Active tab, select a validator and then select\n" +
            "the Actions button.",
        "STAKING_FAQ23": "A window appears with the validator name, commission percentage, and actions you can\n" +
            "perform. Click Delegate.",
        "STAKING_FAQ24": "In the Delegating to \"VALIDATOR\" window, enter the delegation XPRT token amount. The\n" +
            "                                Balance XPRT is displayed.",
        "STAKING_FAQ25": "Optionally, enter your comments or remarks in Memo.",
        "STAKING_FAQ26": "Click Submit",
        "STAKING_FAQ27": "Enter your wallet Password.",
        "STAKING_FAQ28": "Click Submit. A confirmation message appears after the successful delegation of the XPRT token. The transaction hash link is provided. You can click the link and view the\n" +
            "transaction details or you can review the delegation details under\n" +
            "the Transactions tab.",
        "STAKING_FAQ3": " When do I claim the rewards?",
        "STAKING_FAQ31": "You can delegate your XPRT to more than one validator. You can claim rewards from all\n" +
            "                        the validators by using the Claim button that is adjacent to the Rewards in the\n" +
            "                        wallet details or you can claim staking rewards from a single validator transaction:",
        "STAKING_FAQ32": "In the Claiming Rewards window, select Validator.",
        "STAKING_FAQ33": "The value of each XPRT token is indicated in USD. The total available XPRT also is\n" +
            "                                displayed.",
        "STAKING_FAQ34": "Specify the comments or remarks in Memo.",
        "STAKING_FAQ35": "Click Next and enter your Password.",
        "STAKING_FAQ36": "Click Submit. Your rewards appear in the wallet details region.",
        "STAKING_FAQ4": "How can I redelegate XPRT to another validator?",
        "STAKING_FAQ41": "After you delegate your XPRT token with a validator and for some reason, you may want\n" +
            "                        to redelegate the XPRT to another validator, you can redelegate the XPRT by selecting the\n" +
            "                        transaction in the Staking page:",
        "STAKING_FAQ42": "From the Staking page, Active tab, select a validator transaction and\n" +
            "                                click\n" +
            "                                the Actions button.",
        "STAKING_FAQ43": "A window appears with the validator name, commission percentage, and actions you can\n" +
            "                                perform. Click Redelegate",
        "STAKING_FAQ44": "In the Redelegating from \"VALIDATOR\" window, select validator name\n" +
            "                                to Redelegate the XPRT.",
        "STAKING_FAQ45": "Enter the Delegation Amount.",
        "STAKING_FAQ46": "Enter the Redelegation XPRT Amount.",
        "STAKING_FAQ47": "Optionally, enter your comments or remarks in Memo.",
        "STAKING_FAQ48": "Click Next.",
        "STAKING_FAQ49": "Enter your wallet Password.",
        "STAKING_FAQ410": "Click Submit. A confirmation message appears after the successful redelegation of\n" +
            "                                the\n" +
            "                                XPRT token. The transaction hash link is provided. You can click the link and view the\n" +
            "                                transaction details or you can review the delegation details under\n" +
            "                                the Transactions tab.",
        "STAKING_FAQ5": "How and when can I unbond the XPRT token?",
        "STAKING_FAQ51": "After you delegate the XPRT token, they are in the bonding period of 21 days. You can\n" +
            "                        unbond them earlier by selecting the transaction in the Active or Inactive tab of the\n" +
            "                        Staking page.",
        "STAKING_FAQ52": "After selecting the transaction and click Actions .",
        "STAKING_FAQ53": "In the validator window click Unbond. Note the commission percentage of the validator.",
        "STAKING_FAQ54": "In the Unbond from \"VALIDATOR\" window, specify  Delegation Amount.",
        "STAKING_FAQ55": "Enter Unbound XPRT Amount to unbond.",
        "STAKING_FAQ56": "Enter a note or remarks in the Memo field.",
        "STAKING_FAQ57": "Click Next. If your transaction isn’t eligible for unbonding, then the Next button is\n" +
            "                                dimmed.",
        "STAKING_FAQ58": "Enter your password and click Submit. The transaction hash appears and you can\n" +
            "                                find the details when you click the link.",


        "WALLET": "Wallet",
        "IMPORT_WALLET": "Import Wallet",
        "FAQ": "Frequently Asked Questions",
        "USE_KEPLER": "Use Kepler",
        "CONTINUE_WITH_ADDRESS": "Continue with Address",
        "USE_KEPLER_BROWSER_EXTENSION": "Use Keplr Browser Extension",
        "CONNECT":"Connect",
        "KEPLER_ERROR":"There was an error connecting to the Keplr extension:",
        "KEPLER_ACCOUNT_NOTE": "\n" +
            "Below account we've received from the Keplr browser extension.",
        "USE": "Use",
        "ADDRESS": "Address",
        "SUBMIT": "Submit",
        "NEXT": "Next",
        "ENTER_ADDRESS": "Enter Address",
        "ABOUT_WALLET":"About Persistence Wallet",
        "SIGNUP_NOTE_HEADING": "Take a moment to read through this content for your own safety",
        "SIGNUP_NOTE_TEXT1": "Users need to securely store their Mnemonic (seed phrase) to prevent loss of funds. Losing or exposing this phrase could potentially lead to users' funds being stolen.",
        "SIGNUP_NOTE_TEXT2": "Users can view and save their mnemonic while creating a wallet.",
        "ALREADY_HAVE_WALLET": "Already Have a wallet ?",
        "MNEMONIC": "Mnemonic",
        "SEED_PHRASE": "Seed Phrase",
        "SEED_WARNING": "Please securely store the mnemonic for future use",
        "GENERATE_KEY_STORE": "Generate KeyStore File",
        "ADVANCED": "Advanced",
        "ACCOUNT": "Account",
        "ACCOUNT_NUMBER":"Account Number",
        "ACCOUNT_INDEX": "Account Index",
        "BIP_PASSPHRASE": "bip39Passphrase",
        "ENTER_BIP_PASSPHRASE": "Enter bip39Passphrase (Optional)",
        "BIP_PASSPHRASE_ERROR":"Length should be below 50 characters",
        "OPTIONAL": "Optional",
        "WALLET_PATH": "Wallet path",
        "WALLET_PATH_WARNING":"Please securely store the wallet path for future use",
        "USE_PRIVATE_KEY": "Use Private Key",
        "ENTER_MNEMONIC": "Enter Mnemonic",
        "USE_MNEMONIC": "Use Mnemonic",
        "PASSWORD": "Password",
        "ENTER_PASSWORD": "Enter Password",
        "KEY_STORE_FILE":"KeyStore file",
        "DONE":"Done",
        "PRIVATE_KEY_WARNING": "Password decrypts your Private Key (KeyStore file).",
        "PRIVATE_KEY_PASSWORD_NOTE": "Password encrypts your seed phrase. This password does not help you generate your seed phrase.",
        "KEYSTORE_FILE_NOTE": "This is your KeyStore json file. Please secure in a safe place",
        "STAKING": "Staking",
        "EXPLORER": "Explorer",
        "CLOSE_WALLET": "Close Wallet",
        "WALLET_ADDRESS": "Wallet Address",
        "TOTAL_BALANCE": "Total Balance",
        "DELEGATED": "Delegated",
        "CURRENT_PRICE": "Current Price",
        "CURRENT_VALUE": "Current Value",
        "AMOUNT_UNDER_VESTING": "Amount under vesting",
        "TRANSFERABLE_AMOUNT": "Transferable Amount",
        "REWARDS": "Rewards",
        "UNBONDING_TOKEN": "Unbonding Token  ",
        "AVAILABLE_DELEGATE_AMOUNT": "Amount available to delegate",
        "CLAIM": "Claim",
        "CLAIMING_REWARDS": "Claiming Rewards",
        "SELECT_VALIDATOR": "Select Validator",
        "TOTAL_AVAILABLE": "Total Available",
        "MEMO": "Memo",
        "ENTER_MEMO": "Enter Memo",
        "SET_WITHDRAW_ADDRESS": "Set Withdraw Address",
        "WITHDRAW_ADDRESS":"Withdraw Address",
        "ENTER_WITHDRAW_ADDRESS":"Enter Withdraw Address",
        "SET_REWARDS_WITHDRAW_ADDRESS": "Set Rewards Withdraw Address",
        "WITHDRAWAL_ADDRESS": "Withdrawal Address",
        "ENTER_WITHDRAWAL_ADDRESS": "Enter Withdrawal Address",
        "SEND": "Send",
        "RECEIVE": "Receive",
        "TRANSACTIONS": "Transactions",
        "RECIPIENT_ADDRESS": "Recipient Address",
        "SEND_AMOUNT": "Send Amount",
        "RECEIVED": "Received",
        "CHOOSE_VALIDATOR": "Choose a Validator",
        "ACTIVE": "Active",
        "IN_ACTIVE": "Inactive",
        "CLAIM_STAKING_REWARDS":"Claim Staking Rewards",
        "AVAILABLE":"Available",
        "SUCCESSFULLY_CLAIMED":"Successfully Claimed Rewards!",
        "FAILED_CLAIMING":"Failed to Claimed Rewards",
        "COMMISSION":"Commission",
        "WEBSITE":"Website",
        "DESCRIPTION":"Description",
        "CLAIM_REWARDS":"Claim Rewards",
        "UNBOND":"Unbond",
        "REDELEGATE":"Redelegate",
        "DELEGATE":"Delegate",
        "BALANCE":"Balance",
        "SUCCESSFULL_DELEGATED":"Successfully Delegated!",
        "FAILED_DELEGATE":"Failed to Delegate",
        "SUCCESSFULL_REDELEGATED":"Successfully Redelegated!",
        "FAILED_REDELEGATE":"Failed to Redelegated",
        "SUCCESSFULL_UNBOND":"Successfully Unbonded!",
        "FAILED_UNBOND":"Failed to Unbond",
        "SUCCESSFULL_SEND":"",
        "FAILED_SEND":"",
        "DELEGATION_AMOUNT":"Delegation Amount",
        "REDELEGATION_AMOUNT":"Redelegation Amount",
        "AMOUNT":"Amount",
        "UNBOND_AMOUNT":" Unbound Amount",


    }
};

export default English;
