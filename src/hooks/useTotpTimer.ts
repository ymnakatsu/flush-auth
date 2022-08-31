import { useRecoilState } from "recoil";
import { useTimer } from "use-timer";
import { totpTimerCountAtom } from "../store/Atoms";
import { useCalcRemainingTime } from "./useCalcRemainingTime";

export const useTotpTimer = () => {
  const { calcRemaining } = useCalcRemainingTime();
  const [count, setCount] = useRecoilState(totpTimerCountAtom);

  useTimer({
    autostart: true,
    onTimeUpdate: async () => {
      // Calculate the initial value of the counter.
      const remaining = calcRemaining();
      setCount(remaining);
    },
  });

  return { count };
};
