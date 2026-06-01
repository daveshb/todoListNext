import { useState } from "react";

export const useContador = () => {
  const name = "guitarHero";

  const [contador, setContador] = useState(0);

  const increment = () => {
    setContador(contador + 1);
  };

  const decrement = () => {
    if (contador <= 0) return;
    setContador(contador - 1);
  };

  const reset = () => {
    setContador(0);
  };

  return {
    contador,
    name,
    increment,
    decrement,
    reset,
  };
};
