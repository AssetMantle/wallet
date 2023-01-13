import { useDelegatedValidators } from "../data";
import { useAllValidators } from "../data";

const VoteInfo = () => {
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
    <div className="col-12 pt-3 pt-lg-0 col-lg-4">
      <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll">
        <nav className="d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex gap-3 align-items-center">
            <button className={`body2 text-primary`}>Your Statistics</button>
          </div>
        </nav>
        <div className="nav-bg rounded-4 d-flex flex-column p-3 gap-2 align-items-start">
          <p className="caption">Your Voting Power is </p>
          {totalDelegatedAmount && allValidators ? (
            <p>{(totalDelegatedAmount * 100) / totalTokens}%</p>
          ) : null}
          <br />
        </div>
      </div>
    </div>
  );
};

export default VoteInfo;
