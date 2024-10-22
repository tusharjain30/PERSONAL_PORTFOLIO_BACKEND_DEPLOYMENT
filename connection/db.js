import mongoose from "mongoose";

const connection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "PERSONAL_PORTFOLIO"
    }).then(() => {
        console.log("Connected to Database!")
    }).catch((err)  => {
        console.log("Some error occured while connecting to database!")
    })
}

export default connection;