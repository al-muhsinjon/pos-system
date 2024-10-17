import mongoose, { ConnectOptions } from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URI) {
    return console.error("MongoDB URI is not defined.");
  }

  if (isConnected) {
    console.log("Already connected to the database.");
    return;
  }

  try {
    const options: ConnectOptions = {
      dbName: "POS-system",
      autoCreate: true,
    };

    await mongoose.connect(process.env.MONGO_URI, options);

    isConnected = true;
    console.log("Connect to database");
  } catch (error) {
    console.log("Error connecting to the database");
  }
};
