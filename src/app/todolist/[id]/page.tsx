"use client";

import { getTodoListById } from "@/services/todolist";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


interface todoProps {
  title: string;
  state: string;
  startDate?: string;
  endDate?: string;
}

const DetailsTodoList = () => {

  const [todo , setTodo] = useState<todoProps | null>(null)

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTodoListById(id as string);
      setTodo(res?.data)
    };
    fetchData();
  }, [id]);





  if (!todo) return <p>Cargando...</p>;


  return (
    <div>
      <h1>TodoList Details</h1>
      <p>ID: {id}</p>
      <p>Title: {todo.title}</p>
      <p>State: {todo.state}</p>
      {todo.startDate && <p>Start: {todo.startDate}</p>}
      {todo.endDate && <p>End: {todo.endDate}</p>}
    </div>
  );
};

export default DetailsTodoList;
