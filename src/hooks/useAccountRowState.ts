import { useRecoilState } from "recoil";
import { accountRowStateAtom } from "../store/Atoms";

export const useAccountRowState = () => {
  const [accountRowState, setAccountRowState] =
    useRecoilState(accountRowStateAtom);

  const toggle = () => {
    switch (accountRowState) {
      case "default":
        setAccountRowState("edit");
        break;
      case "edit":
        setAccountRowState("default");
        break;
      default:
        break;
    }
  };

  return {
    accountRowState,
    setAccountRowState,
    isDefault: accountRowState === "default",
    isEdit: accountRowState === "edit",
    toggle,
  };
};
