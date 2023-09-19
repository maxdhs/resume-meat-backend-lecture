import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Welcome to the resume meat backend lecture server!",
  });
});

app.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.send({
        success: false,
        error: "You must provide a username and password when logging in.",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      return res.send({
        success: false,
        error: "User and/or password is invalid.",
      });
    }

    // password matches?
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.send({
        success: false,
        error: "User and/or password is invalid.",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.send({
      success: true,
      token,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

app.post("/users/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const checkUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (checkUser) {
      return res.send({
        success: false,
        error: "Username already exists, please login.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.send({
      success: true,
      token,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
});

// how can i respond to a request at GET /users/token
// saying will send user info if token is valid

app.get("/users/token", async (req, res) => {
  try {
    // how can i see the token in my console here
    // that the user sent
    const token = req.headers.authorization.split(" ")[1];
    // how do i verify and decode this token?
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    // where is user info stored and how do i ask for it?
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    delete user.password;
    res.send({
      success: true,
      user,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/summaries", async (req, res) => {
  const summaries = await prisma.summary.findMany();
  res.send({
    success: true,
    summaries,
  });
});

app.use((req, res) => {
  res.send({ success: false, error: "No route found." });
});

app.listen(3000, () => console.log("Server is up!"));
