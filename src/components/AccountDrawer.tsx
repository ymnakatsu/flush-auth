import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faUser,
  faKey,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";
import { TauriCommand } from "../api/TauriCommand";
import { useEffect } from "react";
import { useAccountDrawer } from "../hooks/useAccountDrawer";
import { useAccounts } from "../hooks/useAccounts";
import { Button, Input, Modal } from "react-daisyui";

type Inputs = {
  accountName: string;
  secretKey: string;
  issuer: string;
};

export const AccountDrawer = () => {
  const { setAccounts } = useAccounts();
  const { setOpen, isOpen, account, isUpdateAccount } = useAccountDrawer();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const accounts = await TauriCommand.saveAccount({
      id: isUpdateAccount ? account.id : "",
      account_name: data.accountName,
      secret_key: data.secretKey,
      issuer: data.issuer,
    });
    setAccounts([...accounts]);
    setOpen(false);
    reset();
  };

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  useEffect(() => {
    setValue("accountName", account.account_name, { shouldDirty: true });
    setValue("secretKey", account.secret_key);
    setValue("issuer", account.issuer);
    // reset();
  }, [account, setValue]);

  return (
    <>
      <Modal
        className="absolute top-0 bg-neutral w-screen h-screen max-h-screen p-0"
        open={isOpen}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <div className="py-1 pl-5 text-left">Account</div>
            <div className="flex flex-col justify-between bg-base-100 p-2">
              <div className="flex flex-col justify-between space-y-2">
                {/* Account Name */}
                <div className="form-control w-full max-w-xs">
                  <label className="flex space-x-2">
                    <FontAwesomeIcon icon={faUser} className="pl-2" />
                    <span className="label-text">Account Name</span>
                  </label>
                  <Input
                    size="sm"
                    color={`${errors.accountName ? "error" : "info"}`}
                    {...register("accountName", {
                      required: "Required.",
                      max: {
                        value: 200,
                        message: "200 characters or less.",
                      },
                    })}
                  />
                  {errors.accountName && (
                    <span className="text-left label-text text-red-600 pt-1">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="px-2"
                      />
                      {errors.accountName?.message}
                    </span>
                  )}
                </div>

                {/* Secret Key */}
                <div className="form-control w-full max-w-xs">
                  <label className="flex space-x-2">
                    <FontAwesomeIcon icon={faKey} className="pl-2" />
                    <span className="label-text">Secret Key</span>
                  </label>
                  <Input
                    size="sm"
                    color={`${errors.secretKey ? "error" : "info"}`}
                    disabled={isUpdateAccount ? true : undefined}
                    {...register("secretKey", {
                      disabled: isUpdateAccount ? true : undefined,
                      required: "Required.",
                      pattern: {
                        value: /^[A-Z2-7]+=*$/,
                        message: "enter with A-Z2-7",
                      },
                      max: {
                        value: 200,
                        message: "200 characters or less.",
                      },
                    })}
                  />
                  {errors.secretKey && (
                    <span className="text-left label-text text-red-600 pt-1">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="px-2"
                      />
                      {errors.secretKey?.message}
                    </span>
                  )}
                </div>

                {/* Issuer */}
                <div className="form-control w-full max-w-xs">
                  <label className="flex space-x-2">
                    <FontAwesomeIcon
                      icon={faBuildingColumns}
                      className="pl-2"
                    />
                    <span className="label-text">Issuer</span>
                  </label>
                  <Input
                    size="sm"
                    color={`${errors.issuer ? "error" : "info"}`}
                    {...register("issuer", {
                      max: {
                        value: 200,
                        message: "200 characters or less.",
                      },
                    })}
                  />
                  {errors.issuer && (
                    <span className="text-left label-text text-red-600 pt-1">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="px-2"
                      />
                      {errors.issuer?.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-around mt-5">
                <Button color="primary" size="sm" className="w-28">
                  Save
                </Button>
                <Button
                  color="ghost"
                  size="sm"
                  className="w-28"
                  type="button"
                  onClick={() => onCancel()}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};
