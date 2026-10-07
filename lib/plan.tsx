"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/** Shared trip intent so "Enquire about this tent" or a month in the migration calendar can prefill the planner. */
type Ctx = {
  tentId: string | null;
  month: number | null;
  setTentId: (id: string | null) => void;
  setMonth: (m: number | null) => void;
};
const PlanCtx = createContext<Ctx>({ tentId: null, month: null, setTentId: () => {}, setMonth: () => {} });
export const usePlan = () => useContext(PlanCtx);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [tentId, setTentId] = useState<string | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  return <PlanCtx.Provider value={{ tentId, month, setTentId, setMonth }}>{children}</PlanCtx.Provider>;
}
