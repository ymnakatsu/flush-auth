import { Button, Modal, Select, useTheme } from "react-daisyui";
import { Theme, useStorageTheme } from "../hooks/useStorageTheme";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const SettingModal = (props: Props) => {
  const { setThemeState } = useStorageTheme();

  return (
    <>
      <Modal
        open={props.open}
        className="absolute top-0 w-screen h-screen max-h-screen p-0"
      >
        <div className="flex flex-col px-5 mt-5">
          <div className="flex flex-col">
            <label className="flex space-x-2">
              <span className="label-text">Theme</span>
            </label>
            <Select<Theme>
              defaultValue={"light"}
              children={[
                <option key={"light"} value={"light"}>
                  Light
                </option>,
                <option key={"dark"} value={"dark"}>
                  Dark
                </option>,
              ]}
              onChange={(v) => {
                setThemeState(v);
              }}
            />
          </div>
        </div>

        <Modal.Actions>
          <Button
            color="primary"
            size="sm"
            className="w-20 mr-3"
            onClick={() => {
              props.onClose();
            }}
          >
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
