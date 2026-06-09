"use client";

import { ContextGlobal } from "@/context/Context";
import { useTranslation } from "@/context/i18nContext";
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
  const { name, pi } = useContext(ContextGlobal);
  const { t } = useTranslation();

  const fetchData = async () => {
    const result = await getUser();
    setPerson(result);
  };

  useEffect(() => {
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
      <button onClick={goToAdmin}>{t.adminButton}</button>

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
