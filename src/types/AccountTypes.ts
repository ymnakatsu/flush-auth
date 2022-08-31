export type AccountData = {
  id: string;
  account_name: string;
  issuer: string;
};

export type AccountFormData = {
  id: string;
  secret_key: string;
  account_name: string;
  issuer: string;
};

export type AccountRowState = "default" | "edit";
