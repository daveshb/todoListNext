import Todolist from "@/database/models/todolist";
import conectionDB from "@/lib/database";

await conectionDB();

export async function GET() {
  const datos = await Todolist.find({});

  return Response.json({
    data: datos,
    code: 200,
    message: "el servicio contesto",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTodo = new Todolist(body);
    await newTodo.save();

    return Response.json({
      data: newTodo,
      code: 201,
      message: "tarea creada",
    });
  } catch (error: any) {
    return Response.json({
      error: error.message,
      code: 500,
    }, { status: 500 });
  }
}
