import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import connection from "./connection/db.js";
import fileUpload from "express-fileupload";
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js";
import timelineRouter from "./routes/timeline.routes.js";
import appRouter from "./routes/application.routes.js";
import skillRouter from "./routes/skill.routes.js";
import projectRouter from "./routes/project.routes.js";

let app = express()

config({
    path: './.env'
})

app.use(cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
}))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/app", appRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/project", projectRouter);

connection()
app.use(errorMiddleware)

export default app;