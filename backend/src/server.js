import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";   
const app = express();

app.use(express.json());
app.use(clerkMiddleware()); //req.auth will be availabel in the request object

app.use("/api/inngest",serve({client:inngest,functions}))

app.get("/", (req, res) => {
    res.send("Hello World! qwerty");
});

const startServer=async()=>{
    try {
        await connectDB();
        if(ENV.NODE_ENV!=="production"){
           app.listen(ENV.PORT, () => {
            console.log("Server is running on port:", ENV.PORT);
            connectDB();
            });
            }
    } catch (error) {
        console.log("Error starting Server:",error);
        process.exit(1);
    }
}
startServer();
export default app;