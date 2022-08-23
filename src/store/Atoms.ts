import { atom } from "recoil";
import type {
  AccountData,
  AccountFormData,
  AccountRowState,
} from "../types/AccountTypes";

/**
 * Account list.
 */
export const accountsAtom = atom({
  key: "accountsAtom",
  default: [] as AccountData[],
});

/**
 * Account row state.
 */
export const accountRowStateAtom = atom({
  key: "accountRowStateAtom",
  default: "default" as AccountRowState,
});

/**
 * Edit account.
 */
export const editAccountAtom = atom({
  key: "editAccountAtom",
  default: {
    account_name: "",
    issuer: "",
    secret_key: "",
  } as AccountFormData,
});

/**
 * Drawer state.
 */
export const drawerStateAtom = atom({
  key: "drawerStateAtom",
  default: false,
});
