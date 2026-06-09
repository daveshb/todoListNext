"use client";

import { Card } from "@/components/Card";
import { DarkMode } from "@/components/DarkMode";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "@/context/i18nContext";
import { getTodoList, createTodo, updateTodo, deleteTodo } from "@/services/todolist";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface todoListProps {
  id: string;
  title: string;
  startDate?: number | string | undefined;
  endDate?: number | string | undefined;
  state: "pending" | "inProgress" | "done";
}

export default function Home() {
  const { t } = useTranslation();

  const {card} = t;

  const [valor, setValor] = useState("");
  const [todoList, setTodoList] = useState<todoListProps[]>([]);


  console.log(t)

      const router = useRouter();

  const addTask = async () => {
    if (valor.trim() == "") {
      return;
    }
    const task: todoListProps = {
      id: crypto.randomUUID(),
      title: valor,
      state: "pending",
    };

    const response = await createTodo(task);
    if (response && response.data) {
      setTodoList([...todoList, response.data]);
    }
    setValor("");
  };

  const startTask = async (id: string) => {
    const taskFound = todoList.find((task) => task.id == id);
    if (taskFound) {
      const updates = {
        state: "inProgress",
        startDate: Date.now()
      };
      const response = await updateTodo(id, updates);
      if (response && response.data) {
        setTodoList(todoList.map(t => t.id === id ? { ...t, ...updates } : t));
      }
    }
  };

  const endTask = async (id: string) => {
    const taskFound = todoList.find((task) => task.id == id);
    if (taskFound) {
      const updates = {
        state: "done",
        endDate: Date.now()
      };
      const response = await updateTodo(id, updates);
      if (response && response.data) {
        setTodoList(todoList.map(t => t.id === id ? { ...t, ...updates } : t));
      }
    }
  };

  const deleteTask = async (id: string) => {
    const response = await deleteTodo(id);
    if (response && response.code === 200) {
      setTodoList(todoList.filter((task) => task.id != id));
    }
  };



  
  useEffect(()=>{
    const fetchData = async ()=>{
      const info = await getTodoList();
      console.log(info.data)
      setTodoList(info.data)
    }
    fetchData()
  },[])

const goToAdmin = ()=>{
  router.push("/admin/users")
}


  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="todo-app">
        <h1>{t.title}</h1>

        <h2 className="text-black">{t.card.deleteButton}</h2>
        <h2 className="text-black">{}</h2>


        <div className="flex gap-2 items-center mb-2">
          <DarkMode/>
          <LanguageSelector />
        </div>

        <div className="todo-input">
          <input
            placeholder={t.placeholder}
            onChange={(e) => {
              setValor(e.target.value);
            }}
            value={valor}
          />
          <button className="btn-add" onClick={addTask}>
            {t.addButton}
          </button>
          <button className="btn-add" onClick={goToAdmin}>
            {t.adminButton}
          </button>
        </div>

        <div className="todo-list">
          {todoList.map((task) => {
            return (
              <div key={task.id}>
                <Card
                  description={task.title}
                  state={task.state}
                  startDate={task.startDate}
                  endDate={task.endDate}
                  id={task.id}
                  handleStart={startTask}
                  handleEnd={endTask}
                  handleDelete={deleteTask}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
