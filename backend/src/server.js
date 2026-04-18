import express from "express";
import path from "path";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { functions, inngest } from "./lib/inngest.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

const __dirname = path.resolve();

app.get("/health", (_req, res) => {
    res.status(200).json({ msg: "OK" });
});

// middleware
app.use(express.json());
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}));
app.use("/api/chat", chatRoutes);
app.use(clerkMiddleware());

app.use("/api/inngest", serve({
    client: inngest,
    functions
}));

if(ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*any}", (_req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    })
}

app.listen(ENV.PORT, async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${ENV.PORT}`);
    } catch (error) {
        console.error("❌ Error starting server:", error);
    }
});