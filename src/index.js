import express from "express";
import dotenv from "dotenv";
import usersRoutes from "./routes/users.routes.js";
import urlsRoutes from "./routes/urls.routes.js";
import cors from "cors";
import rankingRoutes from "./routes/ranking.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(usersRoutes);
app.use(urlsRoutes);
app.use(rankingRoutes);

app.listen(4000, () => console.log(`Server running in port: ${4000}`));
