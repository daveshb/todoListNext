"use client";

import { ContextGlobal } from "@/context/Context";
import { getUser } from "@/services/users";
import { Button, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

interface personProps {
  name: string;
  code: number;
  message: string;
}

const User = () => {
  const [person, setPerson] = useState<personProps>();

const {name , pi} = useContext(ContextGlobal);





  const fetchData = async () => {
    const result = await getUser();
    setPerson(result);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const router = useRouter();
  const goToAdmin = () => {
    router.push("/admin/users");
  };

  const goToBack = () => {
    router.back();
  };

  return (
    <>
      <h1>Vista users</h1>
      <div>La persona es: {person?.name}</div>
      <button onClick={goToAdmin}> ir a admin</button>

      {/* {person && (
        <div>{person.name}</div>
      )} */}

      <Button variant="danger" onPress={goToBack}>Ir Atras</Button>

      <Chip>
        {name}
      </Chip>
      <Chip>
        {pi}
      </Chip>
    </>
  );
};

export default User;
