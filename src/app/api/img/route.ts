import { NextRequest } from "next/server"




export async function POST( request: NextRequest){

    // const {title, description, img} = await request.json()

    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const img = formData.get('img') as File | null;


    console.log(title)
    console.log(description)
    console.log(img)



    return Response.json({
        code: 200,
        data:{
            name:" vea que si responde",
            title: title
        }
    })
}




// export async function POST(){
//   const data = "Maribel"

//   console.log("se llamo la función POST")

//   return Response.json({
//     name : data,
//     code: 200,
//     message: "el servicio contesto como POST",
//   })

// }