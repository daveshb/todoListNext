"use client"

import { ContextGlobal } from "@/context/Context";
import { useContext, useEffect, useState } from "react";

interface CardProps {
  description: string;
  state: "pending" | "inProgress" | "done";
  startDate: number | string | undefined;
  endDate: number | string | undefined;
  id: string;
  handleStart: (id: string) => void;
  handleEnd: (id: string) => void;
  handleDelete: (id: string) => void;
}

const stateLabel = {
  pending: "Pendiente",
  inProgress: "En progreso",
  done: "Completado",
};

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
  const [TimeInProgress, setTimeInProgress] = useState("");
   const { isSelected } = useContext(ContextGlobal);
  
  useEffect(() => {
    const startTimestamp = startDate ? new Date(startDate).getTime() : undefined;
    if (!startTimestamp) {
      return;
    }

    const interval = setInterval(() => {
      const diffTime = Date.now() - startTimestamp;
      const diffFormated = new Date(diffTime).toISOString();
      setTimeInProgress(diffFormated.slice(11, 19));
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  const startTimestamp = startDate ? new Date(startDate).getTime() : undefined;
  const endTimestamp = endDate ? new Date(endDate).getTime() : undefined;
  const totalTime = startTimestamp && endTimestamp && endTimestamp - startTimestamp;
  const totalTimeFormated =
    totalTime && new Date(totalTime).toISOString().slice(11, 19);





useEffect(()=>{

  console.log("se ejecuto esta linea")

},[state])






  return (
    <div
      className={`card2 ${state == "inProgress" ? "card-ip" : ""} ${state == "done" ? "card-done" : ""} ${isSelected ? "amber" : ""}`}
    >
      <div className="card-description">{description}</div>
      <div className="card-state-badge">{stateLabel[state]}</div>
      <div className="card-timer">
        {state == "pending" && "Tarea sin iniciar"}
        {TimeInProgress && state == "inProgress" && `Tiempo: ${TimeInProgress}`}
        {state == "done" && `Tiempo: ${totalTimeFormated}`}
      </div>

      {state == "pending" && (
        <button
          className="btn-start"
          onClick={() => {
            handleStart(id);
          }}
        >
          Iniciar tarea
        </button>
      )}

      {state == "inProgress" && (
        <button
          className="btn-end"
          onClick={() => {
            handleEnd(id);
          }}
        >
          Finalizar tarea
        </button>
      )}

      {state == "done" && (
        <button
          className="btn-delete"
          onClick={() => {
            handleDelete(id);
          }}
        >
          Eliminar
        </button>
      )}
    </div>
  );
};
