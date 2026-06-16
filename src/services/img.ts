import axios from "axios";

export const postImg = async (title, description, file) => {
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
    formData.append("img", file);

    const res = await axios.post("/api/img",  formData );

    return res;
  } catch (err) {
    console.error(err);
  }
};
