import mongoose from "mongoose";

export const connectDB = async () => {
  const { connection } = await mongoose.connect(
    "mongodb+srv://jaighai8:oIYf4LcH86FAUxJe@cuvette.jhlei9d.mongodb.net/auth"
  );
  console.log(`MongoDB connected with ${connection.host}`);
};

// MONGO_URI = mongodb://127.0.0.1:27017/authencation
// mongodb+srv://jaighai8:hJKhpTaZlYKAdLm3@cluster0.j6ze9wl.mongodb.net/auth
// username :- jaighai8
// password :- hJKhpTaZlYKAdLm3
