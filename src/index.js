// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("ERRR befor listening ", error);
            throw error
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("MONGODB Connection Failed !!", error);
    })






/*

import express from "express"
const app = express();

// ()()    ==> IIFE
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("ERRR",error);
            throw error
        } )

        app.listen(process.env.PORT , () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("error in connecting with db" , error)
        throw error
    }
})()

*/

