import { NextRequest } from "next/server"
import { uploadToCloudinary } from "../../helpers/uploadImg";


export async function POST( request: NextRequest){

    // const {title, description, img} = await request.json()

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const img = formData.get('img') as File | null;

    if (!img) return Response.json({ code: 400, error: 'No image provided' }, { status: 400 });

    const imgBuffer = Buffer.from(await img.arrayBuffer());


    // enviar a cloudinary
    const respCloudinary = await uploadToCloudinary(imgBuffer, title);
    console.log(respCloudinary)

    

    return Response.json({
        code: 200,
        data:{
            name:" vea que si responde",
            title: title
        }
    })
}
