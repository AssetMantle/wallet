import { useAvailableBalance } from "./swrStore";

export const formReducer = (state = initialState, action) => {
  switch (action.type) {
    // handle onChange for Recipient Address Input Box
    case "CHANGE_RECIPIENT_ADDRESS": {
      console.log("inside CHANGE_RECIPIENT_ADDRESS");
      // if invalid address is input, populate error message and updated recipient address
      if (!action.payload) {
        return {
          ...state,
          recipientAddress: action.payload,
          errorMessages: {
            ...state.errorMessages,
            recipientAddressErrorMsg: formConstants.requiredErrorMsg,
          },
        };
      } else if (isInvalidAddress(action.payload)) {
        return {
          ...state,
          recipientAddress: action.payload,
          errorMessages: {
            ...state.errorMessages,
            recipientAddressErrorMsg: formConstants.recipientAddressErrorMsg,
          },
        };
      }
      // if valid address, remove any previous error message set and return updated recipient address
      else {
        // delete the error message key if already exists
        delete state.errorMessages.recipientAddressErrorMsg;
        return {
          ...state,
          recipientAddress: action.payload,
        };
      }
    }

    case "CHANGE_AMOUNT": {
      console.log(
        "inside CHANGE_AMOUNT, action.payload: ",
        toDenom(action.payload) + parseFloat(chainGasFee)
      );
      // if amount is greater than current balance, populate error message and update amount
      if (isNaN(toDenom(action.payload))) {
        return {
          ...state,
          transferAmount: action.payload,
          errorMessages: {
            ...state.errorMessages,
            transferAmountErrorMsg: formConstants.requiredErrorMsg,
          },
        };
      } else if (
        isNaN(parseFloat(availableBalance)) ||
        toDenom(action.payload) + parseFloat(chainGasFee) >
          parseFloat(availableBalance)
      ) {
        return {
          ...state,
          transferAmount: action.payload,
          errorMessages: {
            ...state.errorMessages,
            transferAmountErrorMsg: formConstants.transferAmountErrorMsg,
          },
        };
      }
      // if valid amount, remove any previous error message set and return updated amount
      else {
        // delete the error message key if already exists
        delete state.errorMessages.transferAmountErrorMsg;
        return {
          ...state,
          transferAmount: action.payload,
        };
      }
    }

    case "SET_HALF_AMOUNT": {
      // if available balance is invalid, set error message
      if (
        isNaN(parseFloat(availableBalance)) ||
        parseFloat(availableBalance) / 2 < parseFloat(chainGasFee)
      ) {
        return {
          ...state,
          transferAmount: 0,
          errorMessages: {
            ...state.errorMessages,
            transferAmountErrorMsg: formConstants.transferAmountErrorMsg,
          },
        };
      }
      // if valid available balance then set half value
      else {
        // delete the error message key if already exists
        delete state.errorMessages.transferAmountErrorMsg;
        return {
          ...state,
          transferAmount: (fromDenom(availableBalance) / 2).toString(),
        };
      }
    }

    case "SET_MAX_AMOUNT": {
      // if available balance is invalid, set error message
      if (
        isNaN(parseFloat(availableBalance)) ||
        parseFloat(availableBalance) < parseFloat(chainGasFee)
      ) {
        console.log(
          "available balance: ",
          parseFloat(availableBalance),
          " gas: ",
          parseFloat(chainGasFee)
        );
        return {
          ...state,
          transferAmount: 0,
          errorMessages: {
            ...state.errorMessages,
            transferAmountErrorMsg: formConstants.transferAmountErrorMsg,
          },
        };
      }
      // if valid available balance then set half value
      else {
        // delete the error message key if already exists
        delete state.errorMessages?.transferAmountErrorMsg;
        console.log(
          "state error message: ",
          state.errorMessages?.transferAmountErrorMsg
        );
        return {
          ...state,
          transferAmount: fromDenom(
            parseFloat(availableBalance) - parseFloat(chainGasFee)
          ).toString(),
        };
      }
    }

    case "SUBMIT": {
      // if any required field is blank, set error message

      let localErrorMessages = state?.errorMessages;
      if (!state.recipientAddress) {
        localErrorMessages = {
          ...localErrorMessages,
          recipientAddressErrorMsg: formConstants.requiredErrorMsg,
        };
      }

      if (!state.transferAmount) {
        localErrorMessages = {
          ...localErrorMessages,
          transferAmountErrorMsg: formConstants.requiredErrorMsg,
        };
      }

      if (!isObjEmpty(localErrorMessages)) {
        return {
          ...state,
          errorMessages: {
            ...state.errorMessages,
            ...localErrorMessages,
          },
        };
      } else {
        return {
          ...state,
        };
      }
    }

    default:
      console.log("default case");
  }
};
