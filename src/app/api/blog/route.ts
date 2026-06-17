import Post from "@/database/models/blog";
import conectionDB from "@/lib/database";

await conectionDB();

export async function GET() {
  const posts = await Post.find({}).sort({ publishedAt: -1 });
  return Response.json({ data: posts, code: 200 });
}
