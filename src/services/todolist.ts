export const getTodoList = async () => {
  try {
    const res = await fetch("/api/todolist");
    const data = res.json();

    return data;
  } catch (err) {
    console.error(err);
  }
};



export const getTodoListById = async (id: string) => {
  try {
    const res = await fetch(`/api/todolist/${id}`);
    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
  }
};
