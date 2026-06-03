import { getTodoListById } from "@/services/todolist";

const DetailsTodoList = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const fetchData = async () => {
    // const data = await getTodoListById(id);
    // console.log(data);

    try {
    const res = await fetch(`/api/todolist/${id}`);
    const data = res.json();

    return data;
  } catch (err) {
    console.error(err);
  }
  };

  fetchData();

  console.log(id);

  return (
    <div>
      <h1>TodoList Details</h1>
      <div> El id es : {id}</div>
      
    </div>
  );
};

export default DetailsTodoList;

// "use client";

// import { getTodoListById } from "@/services/todolist";
// import { useEffect } from "react";

// // eslint-disable-next-line @next/next/no-async-client-component
// const DetailsTodoList = async ({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) => {
//   const { id } = await params;

//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   useEffect(() => {

//     const fetchData = async () => {
//       const data = await getTodoListById(id);
//       console.log(data)
//     };

//     fetchData();
//   }, []);

//   console.log(id);

//   return (
//     <div>
//       <h1>TodoList Details</h1>
//       <div> El id es : {id}</div>
//     </div>
//   );
// };

// export default DetailsTodoList;
