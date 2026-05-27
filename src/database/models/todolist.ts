import { Schema, model, Model } from "mongoose";

const todoLitSchema = new Schema({
    title: {
        type: String,
        required: [true, "The title is required"],
    },
    state: {
        type: String,
        required: [true, "The state is required"],
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    }
});



// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Todolist: Model<any>;
try {
    // Intenta compilar el modelo solo una vez
    Todolist = model("todolists");
} catch (error) {
    // Si el modelo ya está compilado, úsalo
    Todolist = model("todolists", todoLitSchema);
}

export default Todolist;















// import mongoose from "mongoose";

// const Schema = mongoose.Schema;

// const TodolistSchema = new Schema({
  
//   title: String,
//   state: String,
//   dateStart: Date,
//   dateEnd: Date
// });


// export default TodolistSchema


