import { Modal } from "react-daisyui";

export const SettingModal = () => {
  return (
    <>
      <Modal
        className="absolute top-0 w-screen h-screen max-h-screen p-0"
        open={false}
      ></Modal>
    </>
  );
};
