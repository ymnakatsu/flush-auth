import { useAccounts } from "../hooks/useAccounts";
import { Account } from "./Account";

export const Accounts = () => {
  const { accounts } = useAccounts();

  return (
    <>
      {accounts.map((v, i) => {
        return <Account key={i} tabIndex={i} className="m-1" {...v} />;
      })}
    </>
  );
};
