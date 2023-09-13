import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const prisma = new PrismaClient();

// i want to respond to a get request at /

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Welcome to the resume meat backend lecture server!",
  });
});

// GET /summaries that returns all my summaries
app.get("/summaries", async (req, res) => {
  const summaries = await prisma.summary.findMany();
  res.send({
    success: true,
    summaries,
  });
});

// if it doesn't find a route
app.use((req, res) => {
  res.send({ success: false, errro: "No route found." });
});

app.listen(3000, () => console.log("Server is up!"));

// do we even need a db?
// hold projects, users
