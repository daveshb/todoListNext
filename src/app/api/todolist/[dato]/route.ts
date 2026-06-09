import Todolist from "@/database/models/todolist";
import conectionDB from "@/lib/database";

await conectionDB();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dato: string }> },
) {


  const { dato } = await params;
  const isObjectId = dato.length === 24 && /^[0-9a-fA-F]{24}$/.test(dato);
  const query = isObjectId ? { _id: dato } : { id: dato };

  const datos = await Todolist.find(query);

  return Response.json({
    data: datos,
    code: 200,
    message: "el servicio contesto",
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ dato: string }> },
) {
  try {
    const { dato } = await params;
    const body = await request.json();
    const isObjectId = dato.length === 24 && /^[0-9a-fA-F]{24}$/.test(dato);
    const query = isObjectId ? { _id: dato } : { id: dato };
    const updatedTodo = await Todolist.findOneAndUpdate(query, body, { new: true });
    
    return Response.json({
      data: updatedTodo,
      code: 200,
      message: "tarea actualizada",
    });
  } catch (error: any) {
    return Response.json({ error: error.message, code: 500 }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ dato: string }> },
) {
  try {
    const { dato } = await params;
    const isObjectId = dato.length === 24 && /^[0-9a-fA-F]{24}$/.test(dato);
    const query = isObjectId ? { _id: dato } : { id: dato };
    await Todolist.deleteOne(query);
    
    return Response.json({
      code: 200,
      message: "tarea eliminada",
    });
  } catch (error: any) {
    return Response.json({ error: error.message, code: 500 }, { status: 500 });
  }
}
