import { useReducer } from "react";
import { defaultChainGasFee } from "../config";
import {
  useDelegatedValidators,
  useAllValidators,
  useAllProposals,
  useAvailableBalance,
  fromDenom,
  toDenom,
} from "../data";
import { formConstants } from "./constants";

const UseStakeReducer = () => {
  const { availableBalance, denom, errorAvailableBalance } =
    useAvailableBalance();

  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  const initialState = {
    delegationAmount: "",
    delegationAddress: "",
    redelegationSrc: "",
    redelegationDestination: "",
    redelegationAmount: "",
    undelegationAmount: "",
    undelegationSrc: "",
    selectedValidators: [],
    memo: "",
    // all error values -> errorMessages: {recipientAddressErrorMsg: "", undelegationAmountErrorMsg: "" }
    errorMessages: {},
  };

  const stakeReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_DELEGATION_ADDRESS": {
        return { ...state, delegationAddress: action.payload };
      }

      case "SET_SELECTED_VALIDATORS": {
        return {
          ...state,
          selectedValidators: [...state?.selectedValidators, action.payload],
        };
      }

      case "REMOVE_FROM_SELECTED_VALIDATORS": {
        const validators = state?.selectedValidators;
        const filteredValidators = validators.filter(
          (item) => item !== action.payload
        );
        return { ...state, selectedValidators: filteredValidators };
      }

      case "SET_MAX_DELEGATION_AMOUNT": {
        if (
          isNaN(parseFloat(availableBalance)) ||
          parseFloat(availableBalance) < parseFloat(defaultChainGasFee)
        ) {
          console.log(
            "available balance: ",
            parseFloat(availableBalance),
            " gas: ",
            parseFloat(defaultChainGasFee)
          );
          return {
            ...state,
            delegationAmount: 0,
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
            delegationAmount: fromDenom(
              parseFloat(availableBalance) - parseFloat(defaultChainGasFee)
            ).toString(),
          };
        }
      }
      case "CHANGE_DELEGATION_AMOUNT": {
        console.log(
          "inside CHANGE_DELEGATION_AMOUNT, action.payload: ",
          toDenom(action.payload) + parseFloat(defaultChainGasFee)
        );
        // if amount is greater than current balance, populate error message and update amount
        if (isNaN(toDenom(action.payload))) {
          return {
            ...state,
            delegationAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              transferAmountErrorMsg: formConstants.requiredErrorMsg,
            },
          };
        } else if (
          isNaN(parseFloat(availableBalance)) ||
          toDenom(action.payload) + parseFloat(defaultChainGasFee) >
            parseFloat(availableBalance)
        ) {
          return {
            ...state,
            delegationAmount: action.payload,
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
            delegationAmount: action.payload,
          };
        }
      }
      case "SET_MAX_UNDELEGATION_AMOUNT": {
        const delegatedAmount = delegatedValidators?.find(
          (item) => item?.operator_address === state?.selectedValidators[0]
        )?.delegatedAmount;
        if (
          isNaN(parseFloat(delegatedAmount)) ||
          parseFloat(delegatedAmount) < parseFloat(defaultChainGasFee)
        ) {
          console.log(
            "available balance: ",
            parseFloat(delegatedAmount),
            " gas: ",
            parseFloat(defaultChainGasFee)
          );
          return {
            ...state,
            undelegationAmount: 0,
            errorMessages: {
              ...state.errorMessages,
              undelegationAmountErrorMsg:
                formConstants.undelegationAmountErrorMsg,
            },
          };
        }
        // if valid available balance then set half value
        else {
          // delete the error message key if already exists
          delete state.errorMessages?.undelegationAmountErrorMsg;
          console.log(
            "state error message: ",
            state.errorMessages?.undelegationAmountErrorMsg
          );
          return {
            ...state,
            undelegationAmount: fromDenom(
              parseFloat(delegatedAmount) - parseFloat(defaultChainGasFee)
            ).toString(),
          };
        }
      }

      case "SET_MAX_REDELEGATION_AMOUNT": {
        const delegatedAmount = delegatedValidators?.find(
          (item) => item?.operator_address === state?.selectedValidators[0]
        )?.delegatedAmount;
        if (
          isNaN(parseFloat(delegatedAmount)) ||
          parseFloat(delegatedAmount) < parseFloat(defaultChainGasFee)
        ) {
          console.log(
            "available balance: ",
            parseFloat(delegatedAmount),
            " gas: ",
            parseFloat(defaultChainGasFee)
          );
          return {
            ...state,
            redelegationAmount: 0,
            errorMessages: {
              ...state.errorMessages,
              undelegationAmountErrorMsg:
                formConstants.undelegationAmountErrorMsg,
            },
          };
        }
        // if valid available balance then set half value
        else {
          // delete the error message key if already exists
          delete state.errorMessages?.undelegationAmountErrorMsg;
          console.log(
            "state error message: ",
            state.errorMessages?.undelegationAmountErrorMsg
          );
          return {
            ...state,
            redelegationAmount: fromDenom(
              parseFloat(delegatedAmount) - parseFloat(defaultChainGasFee)
            ).toString(),
          };
        }
      }

      case "CHANGE_UNDELEGATION_AMOUNT": {
        console.log(
          "inside CHANGE_AMOUNT, action.payload: ",
          toDenom(action.payload) + parseFloat(defaultChainGasFee)
        );
        // if amount is greater than current balance, populate error message and update amount
        if (isNaN(toDenom(action.payload))) {
          return {
            ...state,
            undelegationAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              undelegationAmountErrorMsg: formConstants.requiredErrorMsg,
            },
          };
        } else if (
          isNaN(parseFloat(availableBalance)) ||
          toDenom(action.payload) + parseFloat(defaultChainGasFee) >
            parseFloat(availableBalance)
        ) {
          return {
            ...state,
            undelegationAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              undelegationAmountErrorMsg:
                formConstants.undelegationAmountErrorMsg,
            },
          };
        }
        // if valid amount, remove any previous error message set and return updated amount
        else {
          // delete the error message key if already exists
          delete state.errorMessages.undelegationAmountErrorMsg;
          return {
            ...state,
            undelegationAmount: action.payload,
          };
        }
      }
      case "SET_REDELEGATION_DESTINATION_ADDRESS": {
        console.log(
          "inside SET_REDELEGATION_DESTINATION_ADDRESS, action.payload: ",
          action.payload
        );
        return {
          ...state,
          redelegationDestination: action.payload,
        };
      }
      case "SET_REDELEGATION_SRC_ADDRESS": {
        console.log(
          "inside SET_SRC_DESTINATION_ADDRESS, action.payload: ",
          action.payload
        );
        return {
          ...state,
          redelegationSrc: action.payload,
        };
      }
      case "SET_UNDELEGATION_SRC_ADDRESS": {
        return {
          ...state,
          undelegationSrc: action.payload,
        };
      }
      case "CHANGE_REDELEGATION_AMOUNT": {
        console.log(
          "inside CHANGE_REDELEGATION_AMOUNT, action.payload: ",
          toDenom(action.payload) + parseFloat(defaultChainGasFee)
        );
        // if amount is greater than current balance, populate error message and update amount
        if (
          isNaN(parseFloat(availableBalance)) ||
          toDenom(action.payload) + parseFloat(defaultChainGasFee) >
            parseFloat(availableBalance)
        ) {
          return {
            ...state,
            undelegationAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              undelegationAmountErrorMsg:
                formConstants.undelegationAmountErrorMsg,
            },
          };
        }
        // if valid amount, remove any previous error message set and return updated amount
        else {
          // delete the error message key if already exists
          delete state.errorMessages.undelegationAmountErrorMsg;
          return {
            ...state,
            redelegationAmount: action.payload,
          };
        }
      }
    }
  };

  const [stakeState, stakeDispatch] = useReducer(stakeReducer, initialState);
  return { stakeState, stakeDispatch };
};

export default UseStakeReducer;
