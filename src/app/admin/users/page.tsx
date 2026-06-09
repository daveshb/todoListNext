"use client"

import { DarkMode } from "@/components/DarkMode";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "@/context/i18nContext";
import { useRouter } from "next/navigation";

const AdminUsers = () => {


  const {t} = useTranslation();


    const router = useRouter();

    const goBack = ()=>{
        router.back()
    }
    const goHome = ()=>{
        router.push("/")
    }

  return (
    <div>
      <h1>{t.adminTitle}</h1>

      <div>Aqui va la tabla</div>

        <button className="btn-back mr-2.5" onClick={goBack} > Atras </button>
        <button className="btn-back" onClick={goHome}> I a home </button>

        <DarkMode/>
        <LanguageSelector/>
    </div>
  );
};


export default AdminUsers;
