import axios from "axios";

export interface imgProps{
  title: string;
  description: string;
  img: File | null;
}

export const postImg = async ({ title, description, img }: imgProps) => {
  try {
    // const res = await axios.post("/api/img",{
    //     title,
    //     description,
    //     img: file
    // });
    // console.log(res);
    // return res.data;

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    if (img) {
      formData.append("img", img);
    }

    const res = await axios.post("/api/img",  formData);

    return res;
  } catch (err) {
    console.error(err);
  }
};
