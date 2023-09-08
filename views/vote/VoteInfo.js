import { Stack } from "react-bootstrap";
import { useDelegatedValidators } from "../../data";
import { useAllValidators } from "../../data";

const VoteInfo = ({ isConnected }) => {
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();

  const { allValidators, isLoadingValidators, errorValidators } =
    useAllValidators();

  const totalTokens = allValidators?.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.tokens),
    0
  );

  return (
    // <div className="col-12 pt-3 pt-lg-0 col-lg-4">
    <Stack
      className="rounded-4 p-3 bg-am-gray-200 width-100 transitionAll flex-grow-0"
      gap={2}
    >
      <Stack
        as="nav"
        direction="horizontal"
        gap={3}
        className="align-items-center justify-content-between"
      >
        <Stack direction="horizontal" gap={3} className="align-items-center">
          <button className={`h3 text-primary`}>Voting Statistics</button>
        </Stack>
      </Stack>
      <Stack gap={2} className="bg-black rounded-4 p-3 align-items-start">
        <p className={`caption m-0 ${isConnected ? "" : "text-body"}`}>
          Your Voting Power is{" "}
        </p>
        {isConnected ? (
          totalDelegatedAmount && allValidators ? (
            <p className="text-white-50 m-0">
              {((totalDelegatedAmount * 100) / totalTokens).toFixed(10)}%
            </p>
          ) : (
            <p className="text-white-50 m-0">0%</p>
          )
        ) : (
          <p className="text-white-50 m-0">0%</p>
        )}
      </Stack>
    </Stack>
    // </div>
  );
};

export default VoteInfo;
