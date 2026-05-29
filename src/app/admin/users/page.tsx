"use client"

import { useRouter } from "next/navigation";

const AdminUsers = () => {

    const router = useRouter();

    const goBack = ()=>{
        router.back()
    }
    const goHome = ()=>{
        router.push("/")
    }

  return (
    <div>
      <h1>Administración de ususarios</h1>

      <div>Aqui va la tabla</div>

        <button className="btn-back mr-2.5" onClick={goBack} > Atras </button>
        <button className="btn-back" onClick={goHome}> I a home </button>

    </div>
  );
};


export default AdminUsers;
