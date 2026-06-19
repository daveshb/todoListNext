import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(request: Request) {
  const { titulo } = await request.json();

  if (!titulo?.trim()) {
    return Response.json({ error: "El título es requerido" }, { status: 400 });
  }

  const model = genai.getGenerativeModel({ model: "gemini-flash-latest" });

  let result;
  try {
    result = await model.generateContent(
      `Eres un escritor experto en blogs de tecnología. Genera borradores completos y bien estructurados en formato markdown.\n\nEscribe un borrador completo de blog en markdown para el título: "${titulo}".\nIncluye: introducción atractiva, al menos 3 secciones con subtítulos H2, ejemplos prácticos y una conclusión.`
    );
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string; statusText?: string };
    const status = e?.status ?? 500;
    if (status === 429) {
      return Response.json(
        { error: "Límite de solicitudes alcanzado. Intenta de nuevo en unos segundos." },
        { status: 429 }
      );
    }
    console.error("[blog-draft-g] Gemini error:", e?.status, e?.statusText, e?.message);
    return Response.json(
      { error: e?.message ?? "Error al generar el borrador." },
      { status: status >= 400 ? status : 500 }
    );
  }

  const borrador = result.response.text();

  return Response.json({ borrador });
}
