

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {user, pass} = body;

    console.log(pass)

    return Response.json({
      data: {
        elUsusarioes:user,
        pass: "el pass es secreto"
      },
      code: 201,
      message: "tarea creada",
    });
  } catch (error) {
    return Response.json({
      error: error instanceof Error ? error.message : String(error),
      code: 500,
    }, { status: 500 });
  }
}



export async function GET(request: Request) {


    return Response.json({


    })

}