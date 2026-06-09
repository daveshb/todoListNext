"use client";
import { Button, Chip } from "@heroui/react";
import { useContador } from "./useContador";
import { TrashBin } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ContextGlobal } from '../../context/Context';
import { I18nContext } from "@/context/i18nContext";
import { translations } from "@/locales/translations";

const Contador = () => {
  const { contador, name, increment, decrement, reset } = useContador();

  const router = useRouter()


  const { language } = useContext(I18nContext);

  return (
    <>
      <div>El contador</div>
      <div>{contador}</div>

      <Button onPress={increment}>+1</Button>
      <Button variant="danger-soft" onPress={decrement}>-1</Button>
      <Button variant="danger" onPress={reset}> <TrashBin /> Reset</Button>

      <div>{name}</div>

      <Button onPress={()=>{router.push('/user')}}>Ir User</Button>
      <div>El idioma es: {language}</div>

      
    </>
  );
};

export default Contador;
