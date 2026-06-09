"use client";

import { Card } from "@/components/Card";
import { DarkMode } from "@/components/DarkMode";
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
  const [valor, setValor] = useState("");
  const [todoList, setTodoList] = useState<todoListProps[]>([]);

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
        <h1>Todo list</h1>

        <DarkMode/>

        <div className="todo-input">
          <input
            placeholder="Nueva tarea..."
            onChange={(e) => {
              setValor(e.target.value);
            }}
            value={valor}
          />
          <button className="btn-add" onClick={addTask}>
            Agregar
          </button>
          <button className="btn-add" onClick={goToAdmin}>
            Ir a Admin
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
