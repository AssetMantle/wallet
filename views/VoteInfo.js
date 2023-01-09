const VoteInfo = () => {
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
          <br />
          <p className="caption">Votes made for categories:</p>
          <p className="caption"></p>
        </div>
      </div>
    </div>
  );
};

export default VoteInfo;
