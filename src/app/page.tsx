"use client";

import { Card } from "@/components/Card";
import { getTodoList } from "@/services/todolist";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface todoListProps {
  id: string;
  title: string;
  startDate?: number | undefined;
  endDate?: number | undefined;
  state: "pending" | "inProgress" | "done";
}

export default function Home() {
  const [valor, setValor] = useState("");
  const [todoList, setTodoList] = useState<todoListProps[]>([]);

      const router = useRouter();

  const addTask = () => {
    if (valor.trim() == "") {
      return;
    }
    const task: todoListProps = {
      id: crypto.randomUUID(),
      title: valor,
      state: "pending",
    };

    // setTodoList([...todoList, task]);
    setValor("");
  };

  const startTask = (id: string) => {
    const taskFound = todoList.find((task) => task.id == id);
    if (taskFound) {
      taskFound.state = "inProgress";
      taskFound.startDate = Date.now();
    }
    // setTodoList([...todoList]);
  };

  const endTask = (id: string) => {
    const taskFound = todoList.find((task) => task.id == id);
    if (taskFound) {
      taskFound.state = "done";
      taskFound.endDate = Date.now();
    }
    // setTodoList([...todoList]);
  };

  const deleteTask = (id: string) => {
    const newArray = todoList.filter((task) => task.id != id);
    // setTodoList([...newArray]);
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
