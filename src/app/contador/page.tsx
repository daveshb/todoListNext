"use client";
import { Button } from "@heroui/react";
import { useContador } from "./useContador";
import { TrashBin } from "@gravity-ui/icons";

const Contador = () => {
  const { contador, name, increment, decrement, reset } = useContador();

  return (
    <>
      <div>El contador</div>
      <div>{contador}</div>

      <Button onPress={increment}>+1</Button>
      <Button variant="danger-soft" onPress={decrement}>-1</Button>
      <Button variant="danger" onPress={reset}> <TrashBin /> Reset</Button>

      <div>{name}</div>
    </>
  );
};

export default Contador;
