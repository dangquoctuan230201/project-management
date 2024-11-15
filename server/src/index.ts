import { search } from './controllers/searchController';
import { Server } from './../node_modules/@types/connect/index.d';

import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import searchRoutes from './routes/searchRoutes';
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
//Route_IMPORTS

//CONFIGURATIONS
dotenv.config()
const app = express()
app.use(express.json())//Middleware json
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));//Thêm Cross-Origin-Resource-Policytiêu đề để hạn chế cách chia sẻ tài nguyên giữa các nguồn gốc.
app.use(morgan("common"));// ghi lại chi tiết yêu cầu HTTP theo một định dạng chung.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));//phân tích cú pháp đc mã hoá ỦRL tích hợp
app.use(cors())//kích hoạt cors cho all domains

//Route
app.get("/", (req, res) => {
  res.send("This is home route")
})

app.use("/projects", projectRoutes)
app.use("/tasks", taskRoutes)
app.use("/search", searchRoutes)
app.use("/users", userRoutes)
app.use("/teams", teamRoutes)

// Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
