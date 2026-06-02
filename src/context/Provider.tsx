"use client"
import { JSX, useState } from "react";
import { ContextGlobal } from "./Context";

interface props {
  children: JSX.Element | JSX.Element[];
}


export const Provider = ({children}:props)=>{

    const name = "julio";
    const pi = 3.1416

    const [contador, setContador] = useState(0);
    const [isSelected, setIsSelected] = useState(false);


    return <ContextGlobal.Provider value={{name, pi, contador, setContador, isSelected, setIsSelected}}>
        {children}
    </ContextGlobal.Provider>
}