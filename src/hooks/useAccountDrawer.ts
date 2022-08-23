import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { SecretKeyMask } from "../constants/AccountConst";
import { drawerStateAtom, editAccountAtom } from "../store/Atoms";

export const useAccountDrawer = () => {
  const [isOpen, setOpen] = useRecoilState(drawerStateAtom);
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
    if (isOpen) {
      disableBodyScroll(document.getElementById("root") as HTMLElement);
    } else {
      clearAllBodyScrollLocks();
      clear();
    }
  }, [clear, isOpen]);

  return {
    isOpen,
    setOpen,
    account,
    setAccount,
    isUpdateAccount: account.secret_key === SecretKeyMask,
    clear,
  };
};
