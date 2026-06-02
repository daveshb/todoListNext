"use client"

import { createContext } from "react";

type contextProps ={
    name: string;
    pi: number;
    contador: number;
    setContador: (contador:number)=>void;
    isSelected: boolean;
    setIsSelected: (isSelected:boolean)=>void;
}


export const ContextGlobal = createContext<contextProps>({} as contextProps)




