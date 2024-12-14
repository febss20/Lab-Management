import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect(`${process.env.DB_URI}${process.env.DB_NAME}`);
    console.log("Database connected successfully");
};