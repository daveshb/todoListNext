import { NextRequest } from "next/server";
import { uploadToCloudinary } from "../../helpers/uploadImg";
import Files from "@/database/models/files";
import conectionDB from "@/lib/database";

export async function POST(request: NextRequest) {
  // const {title, description, img} = await request.json()
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const img = formData.get("img") as File | null;

    if (!img)
      return Response.json(
        { code: 400, error: "No image provided" },
        { status: 400 },
      );

    const imgBuffer = Buffer.from(await img.arrayBuffer());

    // enviar a cloudinary
    const respCloudinary = await uploadToCloudinary(imgBuffer, title);

    conectionDB();
    // Guardar en DB

    const newFile = new Files({
      title,
      description,
      fileUrl: respCloudinary,
    });

    await newFile.save();

    return Response.json({
      code: 200,
      data: {
        name: " se guardo la img",
        title: title,
      },
    });
  } catch (err) {
    console.log(err);

    return Response.json({
      code: 500,
      data: {
        message: "internal server error | llame a soporte",
      },
    });
  }
}

export async function GET() {
  try {
    const res = await Files.find({});

    return Response.json({
      code: 200,
      data: res,
    });
  } catch (err) {
    console.error(err);
  }
}
