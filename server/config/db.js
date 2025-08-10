import mongoose from "mongoose";


const dbConnect = async () => {
    try{
       const conn = await mongoose.connect(process.env.MONGO_URL)
       console.log(`MongoDB connected: ${conn.connection.host}`)
    }catch(error){
       console.error(`MongoDB connection error: ${error.message}`)
    }
}
export default dbConnect