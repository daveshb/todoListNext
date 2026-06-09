export const getTodoList = async () => {
  try {
    const res = await fetch("/api/todolist");
    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
  }
};



export const getTodoListById = async (id:string) => {
  try {
    const res = await fetch(`/api/todolist/${id}`);
    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const createTodo = async (task: any) => {
  try {
    const res = await fetch("/api/todolist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

export const updateTodo = async (id: string, updates: any) => {
  try {
    const res = await fetch(`/api/todolist/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const res = await fetch(`/api/todolist/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};
