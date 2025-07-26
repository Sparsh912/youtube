import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: '16kb'}))
// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.static("public"))
// This is a built-in middleware function in Express. It serves static files and is based on serve-static

app.use(cookieParser())


// routes import 
import userRouter from "./routes/user.routes.js";


// routes declaration
app.use("/api/v1/users" , userRouter)

//   http://localhost:4000/api/v1/users/register


export { app }