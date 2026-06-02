"use client";
import { Button, Chip } from "@heroui/react";
import { useContador } from "./useContador";
import { TrashBin } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ContextGlobal } from '../../context/Context';

const Contador = () => {
  const { contador, name, increment, decrement, reset } = useContador();

  const router = useRouter()



  return (
    <>
      <div>El contador</div>
      <div>{contador}</div>

      <Button onPress={increment}>+1</Button>
      <Button variant="danger-soft" onPress={decrement}>-1</Button>
      <Button variant="danger" onPress={reset}> <TrashBin /> Reset</Button>

      <div>{name}</div>

      <Button onPress={()=>{router.push('/user')}}>Ir User</Button>

      
    </>
  );
};

export default Contador;
