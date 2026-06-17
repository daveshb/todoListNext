import { Schema, model, Model } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String },
    publishedAt: { type: String, required: true },
    readTime: { type: Number },
    tags: [{ type: String }],
  },
  { collection: "posts" }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Post: Model<any>;
try {
  Post = model("posts");
} catch {
  Post = model("posts", blogSchema, "posts");
}

export default Post;
