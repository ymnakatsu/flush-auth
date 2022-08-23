export const useCalcRemainingTime = () => {
  const calcRemaining = () => {
    return 30 - (Math.floor(Date.now() / 1000) % 30);
  };
  return { calcRemaining };
};
