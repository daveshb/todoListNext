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
