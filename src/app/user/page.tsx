"use client";

import { getUser } from "@/services/users";
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

  return (
    <>
      <h1>Vista users</h1>
      <div>La persona es: {person?.name}</div>

      {/* {person && (
        <div>{person.name}</div>
      )} */}
    </>
  );
};

export default User;
