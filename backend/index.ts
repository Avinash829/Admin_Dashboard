import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import casesRouter from "./routes/cases";
import servicesRouter from "./routes/services";
import teamRouter from "./routes/team";
import partnersRouter from "./routes/partners";
import dashboardRouter from "./routes/dashboard";
import tasksRouter from "./routes/tasks";


dotenv.config();
const app = express();

// Middleware
app.use(express.json());

dotenv.config();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_PROD
];

app.use(cors({
    origin: function (origin, callback) {

        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));


// MongoDB connection
mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/cases", casesRouter);
app.use("/api/services", servicesRouter);
app.use("/api/teams", teamRouter);
app.use("/api/partners", partnersRouter);


// Default route
app.get("/", (req, res) => res.send("API is running"));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
