

export async function GET(){
  const data = "Maribel"

  console.log("se llamo la función GET")

  return Response.json({
    name : data,
    code: 200,
    message: "el servicio contesto",
  })

}






export async function POST(){
  const data = "Maribel"

  console.log("se llamo la función POST")

  return Response.json({
    name : data,
    code: 200,
    message: "el servicio contesto como POST",
  })

}