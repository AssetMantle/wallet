import { useReducer } from "react";

const UseVoteReducer = () => {
  const initialState = {
    proposalID: "",
    //Vote options are numbers. Check gov.ts(path:modules/cosmos/gov/v1beta1) for more info on which umber corresponds to which vote
    voteOption: 0,
    memo: "",
    errorMessages: {},
  };

  const stakeReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_PROPOSAL_ID": {
        return { ...state, proposalID: action.payload };
      }
      case "SET_VOTE_OPTION": {
        return { ...state, voteOption: action.payload };
      }
      case "SUBMIT_VOTE": {
        if (voteOption == 0) {
          return {
            ...state,
            errorMessages: {
              ...state.errorMessages,
              voteErrorMsg: "Please select an option",
            },
          };
        } else {
          return {
            ...state,
            errorMessages: {},
          };
        }
      }
    }
  };

  const [voteState, voteDispatch] = useReducer(stakeReducer, initialState);
  console.log(voteState);
  return { voteState, voteDispatch };
};

export default UseVoteReducer;
