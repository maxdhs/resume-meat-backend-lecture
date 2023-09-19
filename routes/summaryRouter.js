import express from "express";
import { prisma } from "../index.js";

export const summaryRouter = express.Router();

summaryRouter.post("/", async (req, res) => {
  try {
    const { text, projectName } = req.body;
    if (!text || !projectName) {
      return res.send({
        success: false,
        error:
          "Please include both text and project name when creating a summary",
      });
    }

    if (!req.user) {
      return res.send({
        success: false,
        error: "You must be logged in to create a submission.",
      });
    }

    const summary = await prisma.summary.create({
      data: {
        projectName,
        text,
        userId: req.user.id,
      },
    });
    res.send({ success: true, summary });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

summaryRouter.get("/", async (req, res) => {
  const summaries = await prisma.summary.findMany();
  res.send({
    success: true,
    summaries,
  });
});
