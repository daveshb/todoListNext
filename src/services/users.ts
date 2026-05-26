
export const getUser = async () => {
  const res = await fetch("/api/hello");
  const data = res.json();

  return data;
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
