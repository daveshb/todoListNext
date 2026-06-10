"use client";

import { Button } from "@heroui/react";
import { useMemo, useState } from "react";

interface props {
  count: number;
  count2:number
}

const Calculo = ({ count, count2 }: props) => {
  // const Calculo = ({count}:{count:number}) => {

  const calculoCostoso = useMemo(() => {
    let result;
    for (let i = 0; i < 1000000000; i++) {
      result = +Math.sqrt(i);
    }
    console.log("se calculo", result);
    return result;
  }, [count]);



  return (
    <>
      <div className="text-black">aqui ca el calculo</div>
      <div className="text-black">El calculo es : {calculoCostoso}</div>
      <div className="text-black">El contador es : {count}</div>
      <div className="text-black">El otro contador es : {count2}</div>
    </>
  );
};

//

const SinMemo = () => {
  const [contador, setContador] = useState(0);
  const [otroContador, setOtroContador] = useState(0);

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-black">ConMemo</h1>
          <Button
            onClick={() => {
              setContador(contador + 1);
            }}
          >
            +1
          </Button>
          <Button
            onClick={() => {
              setOtroContador(otroContador + 1);
            }}
          >
            +1 en el otro
          </Button>

          <Calculo count={contador} count2={otroContador} />
        </div>
      </div>
    </>
  );
};

export default SinMemo;
