import { useCallback, useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useTimer } from "use-timer";
import { TauriCommand } from "../api/TauriCommand";
import type { AccountData } from "../types/AccountTypes";
import { useAccountRowState } from "../hooks/useAccountRowState";
import { useAccountDrawer } from "../hooks/useAccountDrawer";
import { useCalcRemainingTime } from "../hooks/useCalcRemainingTime";
import { useClipboard } from "../hooks/useClipboard";
import { SecretKeyMask } from "../constants/AccountConst";
import { useAccounts } from "../hooks/useAccounts";
import { Alert, Button, Toast } from "react-daisyui";
import { ConfirmDialog } from "./ConfirmDialog";

const ShowCopyAlert = 1;

export type AccountProp = JSX.IntrinsicElements["div"] &
  AccountData & { tabIndex: number };

export const Account = (props: AccountProp) => {
  const { isEdit, isDefault, toggle } = useAccountRowState();
  const { calcRemaining } = useCalcRemainingTime();
  const { setAccounts } = useAccounts();
  const { setAccount, setOpen } = useAccountDrawer();
  const { writeClipboard } = useClipboard();
  const [displayName, setDisplayName] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const copyTimer = useTimer({ endTime: ShowCopyAlert });

  const formatDisplay = useCallback(async () => {
    let disp = `${props.account_name}`;
    if (props.issuer) {
      disp += `(${props.issuer})`;
    }
    setDisplayName(disp);
  }, [props.account_name, props.issuer]);

  const updateTOTP = useCallback(async () => {
    const totp = await TauriCommand.calcTotp(props.id);
    const codes = totp.code.match(/.{3}/g);
    if (codes) {
      setCode(`${codes[0]} ${codes[1]}`);
    }
  }, [props.id]);

  const update = async () => {
    const remaining = calcRemaining();
    if (remaining >= 30 || remaining <= 1) {
      updateTOTP();
    }
    setTimeRemaining(remaining);
  };

  const copyKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      copy();
    }
  };

  const copy = () => {
    writeClipboard(code);
    setCopied(true);
    copyTimer.start();
  };

  const editAccount = () => {
    setAccount({
      id: props.id,
      account_name: props.account_name,
      secret_key: SecretKeyMask,
      issuer: props.issuer,
    });
    setOpen(true);
    toggle();
  };

  const deleteAccount = async () => {
    setOpenConfirm(true);
  };

  const onConfirmDialogClose = async (isOK: boolean) => {
    if (isOK) {
      const accounts = await TauriCommand.deleteAccount(props.id);
      setAccounts([...accounts]);
    }
    setOpenConfirm(false);
  };

  useTimer({
    autostart: true,
    onTimeUpdate: async () => {
      update();
    },
  });

  useEffect(() => {
    const run = async () => {
      await updateTOTP();
    };
    formatDisplay();
    run();
  }, [formatDisplay, updateTOTP]);

  useEffect(() => {
    if (copyTimer.time >= ShowCopyAlert) {
      setCopied(false);
      copyTimer.reset();
      setTimeout(() => {
        TauriCommand.hidden();
      }, 100);
    }
  }, [copyTimer, copyTimer.time]);

  return (
    <div {...props}>
      <Toast
        vertical="bottom"
        horizontal="end"
        className={`transition-opacity opacity-0  ease-in-out ${
          copied ? "opacity-100" : ""
        }`}
      >
        <Alert status="info">Copied!</Alert>
      </Toast>

      <div className="card shadow-2xl">
        <div className="p-3 flex items-center" tabIndex={-1}>
          <div
            className="flex flex-col space-y-2"
            style={{
              minWidth: "200px",
              width: "200px",
            }}
          >
            <div className="flex items-start">
              <label className="card-title text-sm inline-block truncate">
                {displayName}
              </label>
            </div>
            {isDefault && (
              <div className="flex justify-between items-center">
                <label className="ml-2 text-2xl">{code}</label>
                <Button
                  shape="circle"
                  color="info"
                  size="sm"
                  className="btn-outline items-center transition ease-in-out hover:-translate-y-0.5 hover:scale-100"
                  tabIndex={props.tabIndex}
                  onKeyUp={(e) => copyKeyPress(e)}
                  onClick={() => copy()}
                >
                  <FontAwesomeIcon icon={faCopy} />
                </Button>
              </div>
            )}
            {isEdit && (
              <div className="flex justify-end items-center space-x-4">
                <Button
                  shape="circle"
                  color="warning"
                  size="sm"
                  className="btn-outline items-center transition ease-in-out hover:-translate-y-0.5 hover:scale-105"
                  onClick={() => editAccount()}
                >
                  <FontAwesomeIcon icon={faPen} />
                </Button>
                <Button
                  shape="circle"
                  color="error"
                  size="sm"
                  className="btn-outline items-center transition ease-in-out hover:-translate-y-0.5 hover:scale-105"
                  onClick={() => deleteAccount()}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            )}
          </div>
          <div className="flex w-full h-full items-center justify-end">
            <div className="w-12">
              {isDefault && (
                <CircularProgressbar
                  value={timeRemaining}
                  maxValue={30}
                  text={`${timeRemaining}s`}
                  strokeWidth={15}
                  styles={{
                    text: { fontSize: "25" },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        message={`Are you sure you want to delete [${props.account_name}] ?`}
        open={openConfirm}
        onClose={(isOK) => onConfirmDialogClose(isOK)}
      />
    </div>
  );
};
