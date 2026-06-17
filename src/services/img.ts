import axios from "axios";

export interface imgProps{
  title: string;
  description: string;
  img: File | null;
}

export const postImg = async ( title, description, img ) => {
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
      formData.append("img", img);

    const res = await axios.post("/api/img",  formData);

    console.log()

    return res;
  } catch (err) {
    console.error(err);
  }
};



const fetchFiles = async ()=>{

  const resp = await axios.get("/api/img");

  console.log(resp);

  return resp.data


}