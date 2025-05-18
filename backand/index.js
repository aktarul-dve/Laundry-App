const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");


const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0';


//Connect  to MongoDB
connectDB();


app.get("/", (req, res) => {
    res.send("WELCOM TO RABBIT API!");
});

// API Routes
 app.use("/api/users", userRoutes);
 
app.listen(PORT, HOST, () => {
    console.log(`server is running on http://${HOST}:${PORT}`);
});