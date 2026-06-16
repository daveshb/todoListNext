"use client";

import { login } from "@/services/users";
import { Button } from "@heroui/react";
import { useState } from "react";

export const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)



  const handleLogin = async () => {
    if (user && password) {
      try {
        setLoading(true)
        const response = await login(user, password);
        console.log(response);
      } catch (err) {
        console.error(err);
      } finally {
        console.log(" esto siempre se ejecuta");
        setLoading(false)
      }
    } else {
      console.log("ingrese usuario y contraseña");
    }

    setUser("");
    setPassword("");
  };

  return (
    <div>
      <h1>Este es el login</h1>

      <div className="flex flex-col gap-0.5 mt-2">
        <div className="flex flex-col">
          <label>Usuario</label>
          <input
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
            }}
            placeholder="Ingrese su usuario"
          />
        </div>
        <div className="flex flex-col">
          <label>Constraseña</label>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Ingrese su contraseña"
            type="password"
          />
        </div>
        <Button
         onPress={handleLogin}
         isDisabled={loading}
         >
            {loading ? "Cargando..." :"Ingresar"}
        </Button>
      </div>
    </div>
  );
};

export default Login;
