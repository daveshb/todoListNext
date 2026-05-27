import mongoose from "mongoose";


 const conectionDB = async () => {
  try {

    const DBConection = process.env.MONGOURI
    await mongoose.connect(`${DBConection}`);
                            
    console.log('DB Online');
  } catch (err) {
    console.error(err);
  }
};

export default conectionDB
