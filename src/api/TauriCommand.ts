import { invoke } from "@tauri-apps/api/tauri";

import type { AccountData, AccountFormData } from "../types/AccountTypes";
import type { CalcTotp } from "../types/TotpTypes";

export class TauriCommand {
  public static calcTotp = async (id: string) => {
    return (await invoke("calc_totp", { id: id })) as CalcTotp;
  };

  public static loadAccounts = async () => {
    return (await invoke("load_accounts")) as AccountData[];
  };

  public static saveAccount = async (form: AccountFormData) => {
    return (await invoke("save_account", {
      form: {
        id: form.id,
        account_name: form.account_name,
        secret_key: form.issuer,
        issuer: form.issuer,
      } as AccountFormData,
    })) as AccountData[];
  };

  public static updateAccount = async (form: AccountFormData) => {
    return (await invoke("save_account", {
      form: {
        account_name: form.account_name,
        issuer: form.issuer,
      } as AccountFormData,
    })) as AccountData[];
  };

  public static deleteAccount = async (id: string) => {
    return (await invoke("delete_account", {
      id: id,
    })) as AccountData[];
  };

  public static close = async () => {
    await invoke("close");
  };

  public static hidden = async () => {
    await invoke("hidden");
  };
}
