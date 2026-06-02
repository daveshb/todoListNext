"use client"
import { useState } from "react";
import { ContextGlobal } from "./Context";



export const Provider = ({children})=>{

    const name = "julio";
    const pi = 3.1416

    const [contador, setContador] = useState(0);


    return <ContextGlobal.Provider value={{name, pi, contador, setContador}}>
        {children}
    </ContextGlobal.Provider>
}



















// "use client"

// import { JSX, useState } from "react";
// import { MyContext } from "./Context";



// interface props {
//   children: JSX.Element | JSX.Element[];
// }

// export const Provider = ({ children }: props) => {

  
//   const [name, setName] = useState('david');
  

//   return (
//     <MyContext.Provider
//       value={{
      
//         name,
//         setName,
       
//       }}
//     >
//       {children}
//     </MyContext.Provider>
//   );
// };