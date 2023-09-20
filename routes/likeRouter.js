import express from "express";
import { prisma } from "../index.js";

export const likeRouter = express.Router();

// how acn i make an endpoitn for /likes POST
likeRouter.post("/", async (req, res) => {
  try {
    if (!req.user) {
      return res.send({
        success: false,
        error: "Please login to like.",
      });
    }
    const { summaryId } = req.body;
    const like = await prisma.like.create({
      data: {
        summaryId,
        userId: req.user.id,
      },
    });
    res.send({ success: true, like });
  } catch (error) {
    return res.send({ success: false, error: error.message });
  }
});
