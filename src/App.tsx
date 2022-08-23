import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faDownLeftAndUpRightToCenter,
  faPlus,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Theme } from "react-daisyui";
import "./App.css";
import "react-circular-progressbar/dist/styles.css";
import { Accounts } from "./components/Accounts";
import { AccountDrawer } from "./components/AccountDrawer";
import { TauriCommand } from "./api/TauriCommand";
import { useAccountDrawer } from "./hooks/useAccountDrawer";
import { useAccountRowState } from "./hooks/useAccountRowState";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { useState } from "react";

function App() {
  const drawer = useAccountDrawer();
  const { toggle, setAccountRowState } = useAccountRowState();
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

  const hidden = () => {
    TauriCommand.hidden();
    setAccountRowState("default");
  };

  return (
    <div className="App">
      <Theme dataTheme="dark">
        <div className="flex h-8 items-center justify-between bg-neutral px-4">
          <div className="select-none">Flash Auth</div>
          <div className="flex space-x-1">
            <Button
              shape="circle"
              size="sm"
              className="cursor-pointer transition-all ease-in-out opacity-60 hover:opacity-100 duration-600"
              tabIndex={-1}
              onClick={() => openEditAccountDrawer()}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
            <Button
              shape="circle"
              size="sm"
              className="cursor-pointer transition-all ease-in-out opacity-60 hover:opacity-100 duration-600"
              tabIndex={-1}
              onClick={() => editingAccount()}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
            <Button
              shape="circle"
              size="sm"
              className="cursor-pointer transition-all ease-in-out opacity-60 hover:opacity-100 duration-600"
              tabIndex={-1}
              onClick={() => hidden()}
            >
              <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />
            </Button>
            <Button
              shape="circle"
              size="sm"
              className="cursor-pointer transition-all ease-in-out opacity-60 hover:opacity-100 duration-600"
              tabIndex={-1}
              onClick={() => close()}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </div>
        </div>

        <Accounts />

        <AccountDrawer />

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
