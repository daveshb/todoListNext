"use client";

import { getUser } from "@/services/users";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface personProps {
  name: string;
  code: number;
  message: string;
}

const User = () => {
  const [person, setPerson] = useState<personProps>();

  const fetchData = async () => {
    const result = await getUser();
    setPerson(result);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const router = useRouter()
  const goToAdmin = ()=>{
  router.push("/admin/users")
}

  return (
    <>
      <h1>Vista users</h1>
      <div>La persona es: {person?.name}</div>
      <button onClick={goToAdmin}> ir a admin</button>

      {/* {person && (
        <div>{person.name}</div>
      )} */}
    </>
  );
};

export default User;
