"use client"

import { Button } from "@heroui/react";
import { useState } from "react";

interface props {
    count: number
}

const Calculo = ({count}:props) => {
// const Calculo = ({count}:{count:number}) => {
  const caluculoCostoso = () => {
    let result;
    for (let i = 0; i < 1000000000; i++) {
      result = +Math.sqrt(i);
    }
    console.log("se calculo", result)
    return result;
  };

  const calculoResp = caluculoCostoso();

  return (
    <>
      <div className="text-black">aqui ca el calculo</div>
      <div className="text-black">El calculo es : {calculoResp}</div>
      <div className="text-black">El contador es : {count}</div>
      
    </>
  );
};




// 


const SinMemo = () => {


    const [contador, setContador] = useState(0)


  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-black">SinMemo</h1>
          <Button onClick={()=>{setContador(contador+1)}} >+1</Button>


          <Calculo count={contador} />
        </div>
      </div>
    </>
  );
};

export default SinMemo;
