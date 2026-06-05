import Todolist from "@/database/models/todolist";
import conectionDB from "@/lib/database";

await conectionDB();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dato: string }> },
) {


  const { dato } = await params;

  // const datos = await Todolist.find({ _id: dato });
  const datos = await Todolist.findById(dato)
  return Response.json({
    data: datos,
    code: 200,
    message: "el servicio contesto",
  });
}
