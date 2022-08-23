import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { TauriCommand } from "../api/TauriCommand";
import { accountsAtom } from "../store/Atoms";

export const useAccounts = () => {
  const [accounts, setAccounts] = useRecoilState(accountsAtom);

  useEffect(() => {
    const fetchData = async () => {
      const data = await TauriCommand.loadAccounts();
      setAccounts([...data]);
    };
    fetchData();
  }, [setAccounts]);

  return { accounts, setAccounts };
};
