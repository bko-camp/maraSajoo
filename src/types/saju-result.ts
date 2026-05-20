import type { SajuFormPayload } from "./saju";

export type SajuAiContent = {
  summary: string;
  roast: string;
  bait: string;
  paid_solution: string;
};

export type SajuBaziContext = {
  name: string;
  gender: string;
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  timePillar: string;
  fiveElements: string;
};

export type SajuResultRecord = {
  id: string;
  userInfo: Pick<SajuFormPayload, "name" | "gender">;
  sajuData: SajuBaziContext;
  content: SajuAiContent;
  isPaid: boolean;
  createdAt: string;
};
