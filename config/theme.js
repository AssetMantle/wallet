export const getBalanceStyle = (
  balanceString,
  style1ClassName,
  style2ClassName
) => {
  if (balanceString && balanceString.toString().length) {
    const balanceArray = balanceString.toString().split(".");
    if (balanceArray.length > 1) {
      return (
        <span className={style1ClassName}>
          {balanceArray[0]}.
          <span className={style2ClassName}>{balanceArray[1]}</span>
        </span>
      );
    } else {
      return <span className={style1ClassName}>{balanceArray[0]}</span>;
    }
  }
};
