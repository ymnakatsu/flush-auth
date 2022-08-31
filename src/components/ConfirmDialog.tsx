import { Button, Modal } from "react-daisyui";

type Props = {
  message: string;
  open: boolean;
  onClose: (isOk: boolean) => void;
};

export const ConfirmDialog = (props: Props) => {
  return (
    <>
      <Modal open={props.open}>
        <Modal.Body>{props.message}</Modal.Body>
        <Modal.Actions>
          <Button
            color="primary"
            size="sm"
            className="w-20"
            onClick={() => {
              props.onClose(true);
            }}
          >
            OK
          </Button>
          <Button
            color="ghost"
            size="sm"
            className="w-20"
            onClick={() => {
              props.onClose(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
