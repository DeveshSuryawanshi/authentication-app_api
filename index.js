const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {connection} = require("./src/config/db");
const {userRouter} = require("./src/routes/user.routes")

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", userRouter);

app.get("/", async (req, res) => {
  try {
    res.setHeader("text-content", "text/html");
    res.status(200).send("<h1>Welcome to the Authentication-app</h1>");
  } catch (error) {
    res.status(400).json({ error });
  }
});

 app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to the database successfully");
    console.log(`Server is Runing on PORT ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});


