"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LuisaView = () => {
  const router = useRouter();

  const [contador, setContador] = useState(0);
  const [elInput, setElInput] = useState("");

  const goToHome = (num: string) => {
    router.push("/contador");
  };

  const decrement = () => {
    if (contador <= 0) {return}
    setContador(contador - 1);
  };

  const addTask = ()=>{

    const task ={   
        title: elInput,
        date: Date.now(),
        state: "new"

    }

  }


  return (
    <div>
      <h1>Thompson Page</h1>


    <input onChange={(e)=>{setElInput(e.target.value)}}/>


      <button
        onClick={() => {
          goToHome("2");
        }}
      >
        ir a home
      </button>

      <div>El valor es: {contador} </div>

        {/* {contador == 10 ? (<>llego a 10</>) : (<></>)} */}
        {contador == 10 && (<>llego a 10</>)}


      <Button
        onClick={() => {
          setContador(contador + 1);
        }}
      >
        +1
      </Button>
      <Button onClick={decrement}>-1</Button>
      <Button
        onClick={() => {
          setContador(0);
        }}
      >
        Reset
      </Button>
    </div>
  );
};

export default LuisaView;
