import express from "express";
import path from "path";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";

const app = express();

const __dirname = path.resolve();

app.get("/health", (_req, res) => {
    res.status(200).json({ msg: "OK" });
});

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