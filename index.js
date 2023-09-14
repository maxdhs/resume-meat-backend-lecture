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

app.post("/users/register", async (req, res) => {
  const { username, password } = req.body;
  const checkUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (checkUser) {
    return res.send({
      success: false,
      message: "Username already exists, please login.",
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
});

app.get("/summaries", async (req, res) => {
  const summaries = await prisma.summary.findMany();
  res.send({
    success: true,
    summaries,
  });
});

app.use((req, res) => {
  res.send({ success: false, errro: "No route found." });
});

app.listen(3000, () => console.log("Server is up!"));
