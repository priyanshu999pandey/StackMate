import mongoose from "mongoose"

const connectDb = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        // console.log(conn);
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("Failed to Connect with DB ");
        console.error(error.message); 
        process.exit(1)

    }
}

export default connectDb;