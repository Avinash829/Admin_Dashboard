import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import casesRouter from "./routes/cases";
import servicesRouter from "./routes/services";
import teamRouter from "./routes/team";
import partnersRouter from "./routes/partners";


dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cases", casesRouter);
app.use("/api/services", servicesRouter);
app.use("/api/team", teamRouter);
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
