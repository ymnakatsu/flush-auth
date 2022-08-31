export const useClipboard = () => {
  const writeClipboard = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code.replace(" ", ""));
    } else {
      alert("Clipboard API not compatible.");
    }
  };
  return { writeClipboard };
};
