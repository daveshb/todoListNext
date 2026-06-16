import axios from "axios";

export const getUser = async () => {
  const res = await fetch("/api/hello");
  const data = res.json();

  return data;
};

export const login = async (user:string, pass:string) => {
  try{

    const res = await axios.post("api/login",{
      user,
      pass
    })
   
    return res.data
  }
  catch (err){
    console.error(err)
  }

};

















// export const getUser = async () => {
//   try {
//     const response = await fetch("/api/hello");
//     const data = await response.json();

//     return data;
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     throw error;
//   }
// };
