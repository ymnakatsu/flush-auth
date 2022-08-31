import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { SECRET_KEY_MASK } from "../constants/AppConst";
import { accountEditModalStateAtom, editAccountAtom } from "../store/Atoms";

export const useAccountEditModal = () => {
  const [isOpen, setOpen] = useRecoilState(accountEditModalStateAtom);
  const [account, setAccount] = useRecoilState(editAccountAtom);

  const clear = useCallback(() => {
    setAccount({
      id: "",
      account_name: "",
      issuer: "",
      secret_key: "",
    });
  }, [setAccount]);

  useEffect(() => {
    if (!isOpen) {
      clear();
    }
  }, [clear, isOpen]);

  return {
    isOpen,
    setOpen,
    account,
    setAccount,
    isUpdateAccount: account.secret_key === SECRET_KEY_MASK,
    clear,
  };
};
