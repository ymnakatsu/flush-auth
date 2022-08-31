import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPlusCircle,
  faPenToSquare,
  faGear,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Theme, useTheme } from "react-daisyui";
import { Accounts } from "../components/Accounts";
import { AccountEditModal } from "../components/AccountEditModal";
import { TauriCommand } from "../api/TauriCommand";
import { useAccountEditModal } from "../hooks/useAccountEditModal";
import { useAccountRowState } from "../hooks/useAccountRowState";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useEffect, useState } from "react";
import { useTotpTimer } from "../hooks/useTotpTimer";
import { useSystemTheme } from "../hooks/useSystemTheme";
import { MAX_TIMER_VALUE } from "../constants/AppConst";
import { ScrollArea } from "../components/ScrollArea";

function App() {
  const { theme, setTheme } = useTheme();
  const { isDark } = useSystemTheme();
  const drawer = useAccountEditModal();
  const { toggle, isDefault, isEdit } = useAccountRowState();
  const { count } = useTotpTimer();
  const [openConfirm, setOpenConfirm] = useState(false);

  const openEditAccountDrawer = () => {
    drawer.setOpen(true);
  };

  const editingAccount = () => {
    toggle();
  };

  const close = () => {
    setOpenConfirm(true);
  };

  const onConfirmDialogClose = (isOK: boolean) => {
    if (isOK) {
      TauriCommand.close();
    }
    setOpenConfirm(false);
  };

  useEffect(() => {
    setTheme(isDark ? "dark" : "");
  }, [isDark, setTheme]);

  return (
    <div className="">
      <Theme dataTheme={theme} className="min-h-screen">
        <div className="flex flex-col">
          <div className="flex h-8 items-center justify-between px-2 sticky top-0 z-50">
            <div className="select-none">Flash Auth</div>
            <div className="flex space-x-1">
              <Button
                shape="circle"
                size="sm"
                color="ghost"
                className="cursor-pointer transition-all ease-in-out opacity-60 hover:opacity-100 duration-600"
                tabIndex={-1}
                onClick={() => openEditAccountDrawer()}
              >
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  className="text-primary text-lg"
                />
              </Button>
              <Button
                shape="circle"
                size="sm"
                color="ghost"
                className="cursor-pointer transition-all ease-in-out opacity-60 hover:opacity-100 duration-600"
                tabIndex={-1}
                onClick={() => editingAccount()}
              >
                {isDefault && (
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="text-secondary text-lg"
                  />
                )}
                {isEdit && (
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="text-secondary text-lg"
                  />
                )}
              </Button>
              <Button
                shape="circle"
                size="sm"
                color="ghost"
                className="cursor-pointer transition-all ease-in-out opacity-60 hover:opacity-100 duration-600"
                tabIndex={-1}
                onClick={() => close()}
              >
                <FontAwesomeIcon icon={faGear} />
              </Button>
              <Button
                shape="circle"
                size="sm"
                color="ghost"
                className="cursor-pointer transition-all ease-in-out opacity-60 hover:opacity-100 duration-600"
                tabIndex={-1}
                onClick={() => close()}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </div>
          </div>
          <progress
            className={`progress ${
              count < 5 ? "progress-secondary" : "progress-accent"
            }`}
            value={count}
            max={MAX_TIMER_VALUE}
          ></progress>
        </div>

        <ScrollArea>
          <Accounts />
        </ScrollArea>

        <AccountEditModal />

        <ConfirmDialog
          message="Are you sure you want to exit the app?"
          open={openConfirm}
          onClose={(isOK) => onConfirmDialogClose(isOK)}
        />
      </Theme>
    </div>
  );
}

export default App;
