"use client"

import { ContextGlobal } from "@/context/Context";
import { useTranslation } from "@/context/i18nContext";
import { useContext, useEffect, useState } from "react";

interface CardProps {
  description: string;
  state: "pending" | "inProgress" | "done";
  startDate: number | undefined;
  endDate: number | undefined;
  id: string;
  handleStart: (id: string) => void;
  handleEnd: (id: string) => void;
  handleDelete: (id: string) => void;
}

export const Card = ({
  description,
  state,
  startDate,
  endDate,
  id,
  handleStart,
  handleEnd,
  handleDelete,
}: CardProps) => {
  const { t } = useTranslation();
  const [TimeInProgress, setTimeInProgress] = useState("");
  const { isSelected } = useContext(ContextGlobal);
  
  useEffect(() => {
    if (!startDate) {
      return;
    }

    const interval = setInterval(() => {
      const diffTime = Date.now() - startDate;
      const diffFormated = new Date(diffTime).toISOString();
      setTimeInProgress(diffFormated.slice(11, 19));
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  const totalTime = startDate && endDate && endDate - startDate;
  const totalTimeFormated =
    totalTime && new Date(totalTime).toISOString().slice(11, 19);





useEffect(()=>{

  console.log("se ejecuto esta linea")

},[state])




console.log(state);
console.log(t.card[state]);


  return (
    <div
      className={`card2 ${state == "inProgress" ? "card-ip" : ""} ${state == "done" ? "card-done" : ""} ${isSelected ? "amber" : ""}`}
    >
      <div className="card-description">{description}</div>
      <div className="card-state-badge">{t.card[state]}</div>
      <div className="card-timer">
        {state == "pending" && t.card.notStarted}
        {TimeInProgress && state == "inProgress" && `${t.card.time}: ${TimeInProgress}`}
        {state == "done" && `${t.card.time}: ${totalTimeFormated}`}
      </div>

      {state == "pending" && (
        <button
          className="btn-start"
          onClick={() => {
            handleStart(id);
          }}
        >
          {t.card.startButton}
        </button>
      )}

      {state == "inProgress" && (
        <button
          className="btn-end"
          onClick={() => {
            handleEnd(id);
          }}
        >
          {t.card.endButton}
        </button>
      )}

      {state == "done" && (
        <button
          className="btn-delete"
          onClick={() => {
            handleDelete(id);
          }}
        >
          {t.card.deleteButton}
        </button>
      )}
    </div>
  );
};
