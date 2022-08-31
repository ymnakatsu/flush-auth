import { useCallback, useEffect, useState } from "react";

import {
  faCopy,
  faTrash,
  faPen,
  faArrowsV,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Toast } from "react-daisyui";
import { useTimer } from "use-timer";

import { TauriCommand } from "../api/TauriCommand";
import { MAX_TIMER_VALUE, SECRET_KEY_MASK } from "../constants/AppConst";
import { useAccountEditModal } from "../hooks/useAccountEditModal";
import { useAccountRowState } from "../hooks/useAccountRowState";
import { useAccounts } from "../hooks/useAccounts";
import { useClipboard } from "../hooks/useClipboard";
import { useTotpTimer } from "../hooks/useTotpTimer";

import { ConfirmDialog } from "./ConfirmDialog";

import type { AccountData } from "../types/AccountTypes";
import type { DraggableProvided } from "react-beautiful-dnd";

const ShowCopyAlert = 1;

export type AccountProp = JSX.IntrinsicElements["div"] &
  AccountData & {
    tabIndex: number;
    draggableprovided: DraggableProvided;
  };

export const Account = (props: AccountProp) => {
  const { isEdit, isDefault, toggle } = useAccountRowState();
  const { setAccounts } = useAccounts();
  const { setAccount, setOpen } = useAccountEditModal();
  const { writeClipboard } = useClipboard();
  const { count } = useTotpTimer();
  const [displayName, setDisplayName] = useState("");
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
      secret_key: SECRET_KEY_MASK,
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

  useEffect(() => {
    const run = async () => {
      await updateTOTP();
    };
    formatDisplay();
    run();
  }, [formatDisplay, updateTOTP]);

  useEffect(() => {
    if (count >= MAX_TIMER_VALUE || count <= 1) {
      updateTOTP();
    }
  }, [count, updateTOTP]);

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
        className={`transition-opacity opacity-0 ease-in-out z-50 ${
          copied ? "opacity-100" : ""
        }`}
      >
        <Alert status="info">Copied!</Alert>
      </Toast>

      <div className="card shadow-xl">
        <div className="p-3 flex items-center" tabIndex={-1}>
          <div
            className="flex flex-col space-y-2"
            style={{
              minWidth: "200px",
              width: "200px",
            }}
          >
            <div className="flex items-start">
              <div
                className="tooltip tooltip-bottom break-all text-sm z-50"
                data-tip={displayName}
              >
                <label
                  className="card-title text-sm inline-block truncate"
                  style={{ maxWidth: "200px" }}
                >
                  {displayName}
                </label>
              </div>
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
                <li {...props.draggableprovided.dragHandleProps}>
                  <FontAwesomeIcon icon={faArrowsV} />
                </li>
              </div>
            )}
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
